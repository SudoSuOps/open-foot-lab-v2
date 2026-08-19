// POST /api/subscribe — newsletter sign-up.
//
// Two things this does that a naive sign-up does not:
//
//   1. DOUBLE OPT-IN. Submitting adds nobody. It sends a confirmation link,
//      and only clicking it subscribes. For a health-adjacent list this is not
//      politeness — anyone can type someone else's address into a form, and a
//      list built without confirmation is a list you cannot prove consent for.
//
//   2. IT FAILS HONESTLY. Without RESEND_API_KEY this returns an error, not a
//      cheerful "you're subscribed!" over a dropped address. Same rule as
//      contact.js: we do not fake a success.
//
// Bindings:
//   RESEND_API_KEY      required
//   RESEND_AUDIENCE_ID  required — the Resend audience the contact joins
//   SUBSCRIBE_FROM      default "OpenFootLab <care@openfootlab.com>"
//   SITE_URL            default https://www.openfootlab.com
//   SUBSCRIBE_SECRET    required — HMAC key for the confirmation token
//
// CAN-SPAM: every broadcast to this audience must carry an unsubscribe link.
// Resend renders one from {{{RESEND_UNSUBSCRIBE_URL}}} — use it in every send.

export async function onRequestPost({ request, env }) {
  let data;
  try { data = await request.json(); } catch { return json({ error: 'bad_request' }, 400); }

  const email = str(data.email, 160);
  if (data.company) return json({ ok: true });              // honeypot
  if (!isEmail(email)) return json({ error: 'invalid_input' }, 400);

  if (!env.RESEND_API_KEY || !env.SUBSCRIBE_SECRET) {
    return json({
      error: 'unavailable',
      message: `Sign-up is down right now — email ${TEAM} and we'll add you by hand.`,
    }, 503);
  }

  const site = env.SITE_URL || 'https://www.openfootlab.com';
  const token = await sign(email, env.SUBSCRIBE_SECRET);
  const link = `${site}/api/subscribe/confirm?e=${encodeURIComponent(email)}&t=${token}`;

  const sent = await send(env.RESEND_API_KEY, {
    from: env.SUBSCRIBE_FROM || `OpenFootLab <${TEAM}>`,
    to: [email],
    subject: 'Confirm your OpenFootLab sign-up',
    html: confirmEmail(link),
    text: `Confirm your OpenFootLab sign-up: ${link}\n\n`
        + `If you didn't ask for this, ignore this email — nothing happens without the link.`,
  });
  if (!sent) {
    return json({ error: 'send_failed', message: `Something hiccuped — email ${TEAM} and we'll sort it.` }, 502);
  }
  return json({ ok: true, pending: true });
}

// GET /api/subscribe/confirm?e=…&t=… — the second half of the opt-in.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (!url.pathname.endsWith('/confirm')) return json({ ok: true, endpoint: 'subscribe' });

  const email = str(url.searchParams.get('e'), 160);
  const token = str(url.searchParams.get('t'), 128);
  if (!isEmail(email) || !env.SUBSCRIBE_SECRET) return html(page('That link is not valid.', ''), 400);

  const expect = await sign(email, env.SUBSCRIBE_SECRET);
  if (!timingSafeEqual(token, expect)) return html(page('That link is not valid.', ''), 400);

  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID) {
    return html(page("We couldn't finish that.", `Email ${TEAM} and we'll add you by hand.`), 503);
  }

  const r = await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  if (!r.ok && r.status !== 409) {                          // 409 = already on the list
    return html(page("We couldn't finish that.", `Email ${TEAM} and we'll add you by hand.`), 502);
  }
  return html(page("You're on the list.",
    'We write when there is something worth reading — not on a schedule. '
    + 'Every email has an unsubscribe link, and it works.'));
}

const TEAM = 'care@openfootlab.com';

async function sign(email, secret) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(email.toLowerCase()));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function send(key, payload) {
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return r.ok;
  } catch { return false; }
}

const confirmEmail = (link) => `
<div style="font-family:system-ui,sans-serif; max-width:520px; color:#22201C; line-height:1.6;">
  <p>One more step — confirm you want OpenFootLab email:</p>
  <p><a href="${esc(link)}" style="display:inline-block; background:#1F6F4A; color:#F2EEE6;
     text-decoration:none; padding:12px 22px; border-radius:9px; font-weight:600;">Confirm sign-up</a></p>
  <p style="font-size:14px; color:#5E5B54;">If you didn't ask for this, ignore this email.
     Nothing happens without that link.</p>
  <p style="font-size:13px; color:#6E6A5F;">OpenFootLab · Jupiter, FL · ${TEAM}</p>
</div>`;

const page = (h, p) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(h)} — OpenFootLab</title>
<link rel="stylesheet" href="/styles.css"></head>
<body style="background:#F2EEE6; color:#22201C; font-family:system-ui,sans-serif; display:grid;
place-items:center; min-height:100vh; margin:0;"><main style="max-width:460px; padding:40px; text-align:center;">
<h1 style="font-size:26px; margin:0 0 12px;">${esc(h)}</h1>
<p style="color:#5E5B54; line-height:1.6;">${esc(p)}</p>
<p style="margin-top:28px;"><a href="/" style="color:#1F6F4A;">Back to OpenFootLab</a></p>
</main></body></html>`;

const str = (v, n) => String(v ?? '').trim().slice(0, n);
const isEmail = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200, headers: { 'Content-Type': 'application/json' },
  });
}
function html(body, status) {
  return new Response(body, {
    status: status || 200, headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
