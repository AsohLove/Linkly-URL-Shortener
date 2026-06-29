import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";

import { createApp } from "../src/app.js";

test("GET /health endpoint", async (t) => {

    const app = createApp();

    const server = app.listen(0);

    await once(server, "listening");

    const base =
        `http://localhost:${server.address().port}`;

    t.after(() => {
        server.close();
    });

    const response = await fetch(`${base}/health`);

    assert.equal(response.status, 200);

    const body = await response.json();

    assert.deepEqual(body, {
        status: "OK"
    });

});