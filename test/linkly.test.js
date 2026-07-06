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

    // const body = await res.json();

    return res;
}

test("Linkly URL SHORTENER API contract", async (t) => {

    const app = createApp();

    const server = app.listen(0);

    await once(server, "listening");

    const base = `http://localhost:${server.address().port}`;


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

    


    await t.test("POST /auth/login user Login returns a JWT", async () => {
        const res = await fetch(`${base}/auth/login`, {
            method: "POST",
            headers: json,
            body: JSON.stringify({ email: "love@test.com", password: "password123"
            })
        });

        assert.equal(res.status, 200);

        const body = await res.json();
        assert.equal(typeof body.token, "string");

        token = body.token;
    
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


    await t.test("GET /links/:code/clicks.csv exports click log", async () => {

    await fetch(`${base}/${createdCode}`, {
        redirect: "manual"
    });

    const res = await fetch(
        `${base}/links/${createdCode}/clicks.csv`,
        {
            headers: bearer(token)
        }
    );

    assert.equal(res.status, 200);

    const csv = await res.text();

    assert.match(csv, /clicked_at,referrer,user_agent/);

    const lines = csv.trim().split("\n");

    assert.ok(lines.length > 1);

});

    await t.test("GET /:code redirects with response code 302", async () => {

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

    await t.test("SQL injection attempt stays harmless", async () => {

        const res = await fetch(
            `${base}/links/' OR 1=1 --`,
            {
                headers: bearer(token)
            }
        );

        assert.equal(res.status, 400);
    });

    await t.test("Protected endpoint without JWT returns 401", async () => {

        const res = await fetch(`${base}/links`, {
            method: "POST",
            headers: json,
            body: JSON.stringify({
                target_url: "https://google.com"
            })
        });

        assert.equal(res.status, 401);

        const body = await res.json();

        assert.equal(body.success, false);

    });

    await t.test("Duplicate custom short code returns 409", async () => {

        const first = await fetch(`${base}/links`, {
            method: "POST",
            headers: bearer(token),
            body: JSON.stringify({
                target_url: "https://google.com",
                code: "mycode"
            })
        });

        assert.equal(first.status, 201);

        const second = await fetch(`${base}/links`, {
            method: "POST",
            headers: bearer(token),
            body: JSON.stringify({
                target_url: "https://github.com",
                code: "mycode"
            })
        });

        assert.equal(second.status, 409);

    });

    await t.test("Expired link returns 410", async () => {

        const yesterday = new Date(Date.now() - 86400000).toISOString();

        const create = await fetch(`${base}/links`, {
            method: "POST",
            headers: bearer(token),
            body: JSON.stringify({
                target_url: "https://google.com",
                expires_at: yesterday
            })
        });

        assert.equal(create.status, 201);

        const body = await create.json();

        const code = body.data.code;

        const res = await fetch(`${base}/${code}`, {
            redirect: "manual"
        });

        assert.equal(res.status, 410);

    });

    await t.test("Invalid JWT returns 401", async () => {

        const res = await fetch(`${base}/links`, {
            headers: {
                authorization: "Bearer definitely-not-a-token"
            }
        });

        assert.equal(res.status, 401);

    });

});

