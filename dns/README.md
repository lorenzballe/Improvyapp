# DNS

`improvy.app.zone` is the zone as it should be: a BIND file Cloudflare can
import in one go (DNS → Records → Import and Export → Import DNS records).

It is kept here because DNS is the one piece of this project that lives
nowhere in code and that nobody remembers a year later. If the domain ever
moves registrar, this file is the answer to "what was in there?".

**Leave the proxy off when importing.** Cloudflare's orange cloud breaks
GitHub's certificate challenge, and `.app` is on the HSTS preload list, so a
site without a certificate is a site no browser will open.

Two records are *not* here because they carry values only the console can
give you:

- the **TXT** record Search Console asks for, to verify the domain (needed
  for Google's OAuth brand verification, and to upload the app's logo to the
  consent screen);
- later, whatever Firebase Hosting asks for if `auth.improvy.app` is set up
  to serve the sign-in handler, so the login stops showing
  `improvy-f470f.firebaseapp.com`.
