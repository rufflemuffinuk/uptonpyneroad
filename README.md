# Upton Pyne road status

A one-page site showing whether the road is open or closed. Anyone can report a status change, add their name if they're not already suggested, or leave a free-text comment. Storage is handled by Netlify Blobs, built into your Netlify site — nothing to set up by hand.

## Before you deploy

Nothing needs editing this time — there's no lane name or fixed name list baked into the code. The "Your name" field suggests names as people use the site, and anyone can type a new one.

## Deploy it

1. Create a new GitHub repository and push these files to it (`index.html`, `netlify.toml`, `package.json`, and the `netlify/functions/status.js` folder — keep that folder structure exactly as-is).
2. Go to [app.netlify.com](https://app.netlify.com), choose **Add new site → Import an existing project**, and connect the GitHub repo.
3. Leave the build settings as detected (no build command needed, publish directory `.`) and deploy.
4. Netlify Blobs works automatically once the function runs on Netlify — nothing else to configure.

Your site will be live at a `netlify.app` address, which you can share in the WhatsApp group. Netlify also lets you attach a custom domain for free if you'd like something shorter to share.

## What's stored

Three things live in Netlify Blobs, all under the store named `upton-pyne-road`:
- `status` — the current open/closed state, who set it, and when.
- `log` — the last 5 status changes.
- `comments` — the last 10 free-text updates people have posted.

## A note on trust

There's no password — it's open by design, so anyone in the village can report a status or leave a comment. If that ever becomes a problem, `netlify/functions/status.js` is the one place to add a shared access code.
