# Linkly URL Shortener API

## :beginner: Overview 

A RESTful URL Shortener API built with **Node.js**, **Express**, and **PostgreSQL**.

Linkly allows authenticated users to create short URLs, redirect visitors, track click analytics, export click history as CSV, and manage links securely using JWT authentication.

---

## :sparkles: Features

* User registration and login
* JWT authentication
* Password hashing with bcrypt
* Create automatic or custom short URLs
* Redirect short URLs to their original destination
* Link expiration support
* Click tracking and analytics
* CSV export of click history
* Delete links
* OpenAPI (Swagger UI) documentation
* Request validation with Zod
* Parameterized SQL queries
* Atomic database transactions
* Automated API tests using `node:test`
* Security with Helmet, CORS, and rate limiting

---

## :toolbox:  Tech Stack

* Node.js
* Express
* PostgreSQL
* JWT
* bcrypt
* Zod
* node:test
* Swagger UI / OpenAPI 3.0
* Pino
* Helmet
* CORS

---

## Project Structure

```text

Linkly_URL_Shortener/
├── src/
│   ├── server.js        Entry point: start/stop the HTTP server
│   ├── app.js           Build the Express app (security, logging, routes, errors)
│   ├── config.js        Read + validate environment variables (once)
│   ├── db/
        |── dbConnect.js    The PostgreSQL connection pool
│   ├── lib/
│   │   ├── logger.js    pino logger
│   │   ├── passwords.js Hash & verify passwords (scrypt, built-in)
│   │   ├── jwt.js    Sign & verify login tokens (JWT)
│   │   └── generateLinkCode  function to generate random code for each link
│   ├── middleware/
│   │   |── auth-middleware.js      requireAuth — verifies the token, sets req.user
        |── link-rate-limit.js
        |── validate-middleware

    |──validation/
        |── auth-validation Zod validation schemas for authenticated users
        |── link-validation Zod schemas (the shape of every input)
│   ├── models/          The data layer (the "model boundary" — all SQL lives here)
│   │   ├── users-model.js     Accounts (create, find by email)
│   │   └── links-model.js   
│   └── routes/          The HTTP layer (validate → call model → respond)
│       ├── auth-routes.js      POST /auth/register, POST /auth/login
│       ├── docs-route.js
│       ├── links-routes.js
│       └── redirect-routes.js  GET redirected link with /:code
├── db/
│   ├── schemas.sql       users, links, clicks
│   └── seed.sql         sample data
├── scripts/            
    |── migrate.js
    |── seed.js
    |── reset-database.js
├── test/
    |── linkly-test.js             node:test contract tests
├── docs/
    |── openapi.yaml         The API contract (single source of truth for the docs)
└── render.yaml          Cloud deploy blueprint (Render, no Docker — see docs/06-deployment.md)
```

---

## :electric_plug: Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AsohLove/Linkly-URL-Shortener.git


cd Linkly_URL_Shortener
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a PostgreSQL database

Example:

```sql
CREATE DATABASE url_shortener;
CREATE DATABASE url_shortener_test;
```

### 4. Configure environment variables

Create a `.env` file.

```env
PORT=3000

DATABASE_URL=postgres://postgres:password@localhost:5432/url_shortener

JWT_SECRET=your_secret_key

LOG_LEVEL=info
```

Create a `.env.test` file.

```env
PORT=3001

DATABASE_URL=postgres://postgres:password@localhost:5432/url_shortener_test

JWT_SECRET=your_secret_key

NODE_ENV=test
```

### 5. Run database migrations

```bash
npm run migrate
```

### 6. (Optional) Seed the database

```bash
npm run seed
```

### 7. Start the application

Development

```bash
npm run dev # Uses the node built-in --watch  for automatic reload
```

Production

```bash
npm start
```

The API will be available at

```
http://localhost:3000
```

---

## API Documentation

Swagger UI

```
http://localhost:3000/docs
```

Health Check for server liveness

```
http://localhost:3000/health
```

---

## Authentication

Register

```http
POST /auth/register
```

Login

```http
POST /auth/login
```

The login endpoint returns a JWT token.

Include the token in protected requests:

```http
Authorization: Bearer <your-token>
```

---

## Main Endpoints

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| POST   | `/auth/register`          | Register a user               |
| POST   | `/auth/login`             | Login                         |
| POST   | `/links`                  |  🔒 Create a short link           |
| GET    | `/links/:code`            |  🔒 Retrieve link metadata        |
| DELETE | `/links/:code`            |  🔒 Delete a link                 |
| GET    | `/links/:code/clicks`     |  🔒 Retrieve click history        |
| GET    | `/links/:code/clicks.csv` |  🔒 Download click history as CSV |
| GET    | `/:code`                  |  🔒 Redirect to the original URL  |
| GET    | `/health`                 | Liveness                 |
| GET    | `/docs`                   | Swagger UI                   |

---

🔒 = requires `Authorization: Bearer <token>` (from `/auth/login`).


## Running Tests

Run the complete test suite

```bash
npm test # resets the test database(url_shortener_test) and then perform node:test
```

The tests cover:

* Authentication
* Link creation
* Redirects
* Metadata retrieval
* Click analytics
* CSV export
* SQL injection regression
* REST status codes

---

## Deployment

The application is deployment-ready and can be deployed to platforms such as Render.

Required environment variables:

```env
DATABASE_URL=
JWT_SECRET=
PORT=
LOG_LEVEL=
```

---

- GitHub: [@loveasoh](https://github.com/AsohLove)
- Twitter: [@loveasoh](https://x.com/LoveTheModifier)
- LinkedIn: [@love asoh](https://www.linkedin.com/in/asohlove/)

:earth_africa: Based in Cameroon | Open for hybrid opportunities


## :lock: License
This project is [MIT](./LICENSE) licensed.

