# Bakery backend (matched to the uploaded React frontend)

This backend implements the exact API calls currently used by `src/services/api.js`:

- `GET /api/products`
- `GET /api/gifts`
- `GET /api/cities`
- `POST /api/orders`
- `GET /api/health`

## Setup

1. Keep your existing private `server/.env` file; this package intentionally does not include one.
2. Ensure `server/.env` contains `PORT=5000`, `CLIENT_URL=http://localhost:5173`, `MONGODB_DB_NAME=bakery`, and your real Atlas `MONGODB_URI`.
3. From a terminal in `server/`, run `npm install` if needed.
4. Run `npm run seed` once to load the existing frontend catalog (product IDs `p1`–`p10`, gift IDs `g1`–`g3`) and the default location (`Mumbai, Bandra West`). Seeding upserts by stable string ID; it does not wipe unrelated documents.
5. Run `npm run dev`.
6. Test `http://localhost:5000/api/health` and then the three GET endpoints.

## Frontend compatibility notes

- Product and gift payloads keep fields such as `name`, `category`, `tag`, `price`, `eggless`, `rating`, `reviews`, `portion`, `desc`, and `image`.
- Each response has a `products`, `gifts`, or `cities` array, matching `src/services/api.js`.
- The current React checkout submits `{ city, items: [{ productId, quantity }] }`. The API resolves either MongoDB `_id` values (which `BakeryContext` currently prefers) or stable `id` strings, then calculates prices and totals on the server.
- The current UI does not collect customer name, email, phone, delivery address, or a real payment authorization. The backend does not invent these fields and records payment as pending.
- This backend does not modify frontend files. Keep the root `package.json`, root `app.js`, `style.css`, and `src/` as they are.

## Admin authentication and Product CRUD

This version adds an administrator login using bcrypt password hashing and JWTs. There is deliberately no public admin-registration endpoint.

1. Keep the private `server/.env` file (never commit it).
2. Add `JWT_SECRET` with at least 32 random characters, `JWT_EXPIRES_IN=4h`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` (at least 12 characters) to that private file.
3. Run `npm install` in `server/`.
4. Run `npm run create-admin` once to provision the configured admin account.
5. Run `npm run dev` in `server/` and the frontend's `npm run dev` from the project root.
6. Open `http://localhost:5173/admin.html` for the standalone admin interface.

Only authenticated admin users can create, update, or delete products. Never put the JWT signing secret or admin password in frontend code or a `VITE_` variable. The admin page holds the returned short-lived token in `sessionStorage`, clears it on logout, and the server rechecks the account/role on protected requests.
