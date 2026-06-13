# Deploy SkyWyo (Cloudflare Pages + email)

Site hosting, DNS, domain, and email all live in one Cloudflare account. The
domain `skywyo.com` was bought on Cloudflare (owned by the partner's account), so
everything below happens inside that account.

## 1. Host the site (Cloudflare Pages, free)

1. Cloudflare dashboard -> **Workers & Pages** -> Create -> **Pages** -> Connect to Git.
2. Authorize GitHub, pick the repo **NolanNachbar/SkyWyo**.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Save and Deploy. First build takes a couple minutes. You get a
   `*.pages.dev` URL to confirm it works.
5. Every `git push` to the main branch now auto-deploys. Done.

## 2. Connect the domain

1. In the Pages project -> **Custom domains** -> Set up a domain -> `skywyo.com`
   (and add `www.skywyo.com` too).
2. Because the zone is in the same Cloudflare account, Cloudflare adds the DNS
   records and provisions SSL automatically. No A/CNAME juggling, no proxy gotcha.
3. Wait for it to go green (minutes). Site is live on https://skywyo.com.

## 3. Email for info@skywyo.com (Zoho Mail, free)

A real mailbox you can send AND receive from as info@skywyo.com. DNS stays at
Cloudflare; you just paste a few records there.

1. zoho.com/mail -> sign up -> **Forever Free** plan -> "domain you already own"
   -> enter `skywyo.com`.
2. **Verify ownership:** Zoho gives you a TXT record. In Cloudflare ->
   skywyo.com -> DNS -> Records -> add that TXT -> back in Zoho, click Verify.
3. **Create the user** `info@skywyo.com` (this is your inbox).
4. **Add Zoho's MX records** in Cloudflare DNS (mx.zoho.com, mx2.zoho.com,
   mx3.zoho.com, with the priorities Zoho lists). Remove any other MX records so
   they don't conflict.
5. **Add the SPF and DKIM TXT records** Zoho provides (do not skip these - they
   keep your sent mail out of spam folders).
6. Send and receive at mail.zoho.com or the Zoho Mail phone app, as info@skywyo.com.

## Loose ends to finish before launch

- The booking form (`src/components/book/BookForm.tsx`) has its submit endpoint
  commented out - leads currently go nowhere. Wire it to Resend (already a
  dependency) via a Cloudflare Pages Function, or a Formspree endpoint.
- og-image.jpg is a raw hero frame (resolves fine); a branded 1200x630 is better later.
- Hero frames are intentionally left full quality (~57MB). Known mobile-speed
  tradeoff, left as-is per preference.
