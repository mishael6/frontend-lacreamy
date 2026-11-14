# LaCreamy

LaCreamy is a bakery storefront for pastries, cakes and bread in Kumasi, Ghana. The frontend runs on Next.js App Router and keeps the existing shopping cart, account, order and admin experiences.

## Getting started

Requirements: Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm start` serves the production build.

## API server

The frontend sends requests through its same-origin `/api` route, which forwards them to the backend. Start the LaCreamy backend on the development machine before using signup, login, products, orders, or admin features. The backend is not included in this frontend repository.

The proxy uses `API_SERVER_URL` when set, then `NEXT_PUBLIC_API_URL`, and otherwise defaults to `http://localhost:5000/api`. Set the backend URL in the frontend environment, for example:

```env
API_SERVER_URL=http://localhost:5000/api
```

Restart `npm run dev` after changing environment values. For testing from a phone, open the Next.js site using the development machine's LAN address and run Next.js bound to the network interface with `npm run dev -- --hostname 0.0.0.0`. The proxy connects to the backend from the development machine, so the phone does not need to reach `localhost:5000` directly.
