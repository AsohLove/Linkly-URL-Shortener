import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";

import { createApp } from "../src/app.js";
import { pool } from "../src/db/dbConnect.js";

const json = {
    "content-type": "application/json"
};

function bearer(token) {
    return {
        "content-type": "application/json",
        authorization: `Bearer ${token}`
    };
}

// REGISTER helper function
function register(base, email, password) {
    return fetch(`${base}/auth/register`, {
        method: "POST",
        headers: json,
        body: JSON.stringify({
            email,
            password
        })
    });
}

// LOGIN helper function
async function login(base, email, password) {
    const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: json,
        body: JSON.stringify({ email, password })
    });

    const body = await res.json();

    return body.data;
}

test("Linkly URL SHORTENER API contract", async (t) => {

    const app = createApp();

    const server = app.listen(0);

    await once(server, "listening");

    const base = `http://localhost:${server.address().port}`;

    await pool.query(`
        TRUNCATE clicks, links, users
        RESTART IDENTITY CASCADE
    `);

    t.after(async () => {
        server.close();
        await pool.end();
    });

    let token;
    let createdCode;

    // HEALTH
    await t.test("GET /health returns OK", async () => {

        const res = await fetch(`${base}/health`);

        assert.equal(res.status, 200);

        assert.deepEqual(await res.json(), {
            status: "OK"
        });

    });

    
    // REGISTER 
    await t.test("POST /auth/register creates a user", async () => {

        const res = await register( base, "love@test.com", "password123");

        assert.equal(res.status, 201);

        const body = await res.json();
        assert.equal(body.success, true);
        assert.equal(body.data.email, "love@test.com");

    });

    // DUPLICATE
    await t.test("Duplicate email returns 409", async () => {

        const res = await register(base, "love@test.com", "password123");
        assert.equal(res.status, 409);
    });

 
    // LOGIN
    // await t.test("POST /auth/login returns JWT", async () => {

    //     token = await login(base, "love@test.com", "password123");

    //     assert.ok(token);

    // });

     await t.test("POST /auth/login user Login returns a JWT", async () => {
        const response = await login(base, "love@test.com", "password123")
        console.log(response.status);
        
        assert.equal(response.status, 200)
        const body = await response.json()
        console.log(body);
        assert.equal(typeof body.token, 'string')
    
    })

    await t.test("Wrong password returns 401", async () => {

        const res = await fetch(`${base}/auth/login`, {

            method: "POST",

            headers: json,

            body: JSON.stringify({

                email: "love@test.com",

                password: "wrongpassword"

            })

        });

        assert.equal(res.status, 401);

    });

    await t.test("POST /links creates a short link", async () => {

        const res = await fetch(`${base}/links`, {

            method: "POST",

            headers: bearer(token),

            body: JSON.stringify({

                target_url: "https://google.com"

            })

        });

        assert.equal(res.status, 201);

        const body = await res.json();

        createdCode = body.data.code;

        assert.ok(createdCode);

    });

    await t.test("GET /links/:code returns metadata", async () => {

        const res = await fetch(

            `${base}/links/${createdCode}`,

            {

                headers: bearer(token)

            }

        );

        assert.equal(res.status, 200);

    });

    await t.test("GET /links/:code/clicks returns click log", async () => {

        const res = await fetch(

            `${base}/links/${createdCode}/clicks`,

            {

                headers: bearer(token)

            }

        );

        assert.equal(res.status, 200);

    });


    await t.test("GET /links/:code/clicks.csv downloads CSV", async () => {

        const res = await fetch(

            `${base}/links/${createdCode}/clicks.csv`,

            {

                headers: bearer(token)

            }

        );

        assert.equal(res.status, 200);

    });


    await t.test("GET /:code redirects", async () => {

        const res = await fetch(

            `${base}/${createdCode}`,

            {

                redirect: "manual"

            }

        );

        assert.equal(res.status, 302);

    });

    await t.test("DELETE /links/:code deletes link", async () => {

        const res = await fetch( `${base}/links/${createdCode}`,

            { method: "DELETE",
             headers: bearer(token)

            }

        );

        assert.equal(res.status, 204);

    });

});