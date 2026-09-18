# Improvy — the website

What the app is, the method behind it, and the place to buy Pro.

Live at <https://improvy.app>. A static Vite + React
site; `.github/workflows/deploy.yml` builds it and publishes it to GitHub
Pages on every push to `main`.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/, with a relative base so it works at a root domain
npm run lint     # tsc
```

## Pages

Everything is one page with in-page state, except the addresses other things
link to, which are hashes so they survive GitHub Pages having no router:

| Address | What |
|---|---|
| `#privacy`, `#terms` | The legal texts. The app's Settings and the store listings link here. |
| `#pro` | Buy Improvy Pro: sign in, pay with Stripe, done. |
| `#pro/success?session_id=…` | Where Stripe sends a buyer back. Waits for the licence to land. |
| `#pro/cancel` | Where Stripe sends someone who backed out. |

## Buying Pro on the site

The site never touches money and never grants anything. `src/lib/firebase.ts`
signs the buyer into the **same Firebase project as the app**, then asks a
Cloud Function (in the app's repository, `functions/`) for a Stripe Checkout
URL that carries the account id. Stripe takes the payment and calls the
webhook; the webhook writes `entitlements/{uid}`; the app reads that on
sign-in. So a licence bought here is found on any phone the same account
signs in on.

The price on the site (`src/lib/pricing.ts`) is a euro under the store price
on purpose: no store commission.

Setting up Stripe and the functions is written out in the app repository's
`STRIPE_SETUP.md`.
