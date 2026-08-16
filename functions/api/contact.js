// Cloudflare Pages Function — POST /api/contact
//
// Sends TWO emails via Resend:
//   1. the enquiry  -> build@openfootlab.com   (reply-to = the person who wrote in)
//   2. a confirmation -> the person who wrote in (reply-to = build@openfootlab.com)
//
// Environment variables (Pages project → Settings → Environment variables):
//   RESEND_API_KEY  required. Without it this endpoint returns an ERROR, not a fake
//                   success — never tell someone their message landed when it did not.
//   CONTACT_TO      default build@openfootlab.com  — where enquiries go
//   NOTIFY_FROM     default notifications@openfootlab.com — sender of the enquiry mail.
//                   Deliberately NOT build@: sending from and to the same mailbox is
//                   what makes a mailbox auto-responder loop and muddles threading.
//   CONFIRM_FROM    default "OpenFootLab <build@openfootlab.com>" — sender of the
//                   confirmation, so a reply from the customer lands in build@.
//   CONFIRM_OFF     set to "1" to suppress the customer confirmation.
//
// Resend note: the verified domain is openfootlab.com (DKIM at resend._domainkey,
// return-path SPF on send.openfootlab.com). Any local-part @openfootlab.com is valid
// as a From. Do not move From to send.openfootlab.com — that subdomain is the
// return-path, not a mailbox.

const TEAM = 'build@openfootlab.com';

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try { data = await request.json(); } catch { return json({ error: 'bad_request' }, 400); }

  const name = str(data.name, 120);
  const email = str(data.email, 160);
  const dealing = str(data.dealing, 120);
  const message = str(data.message, 5000);

  if (data.company) return json({ ok: true });          // honeypot — bots fill hidden fields
  if (!name || !isEmail(email) || !message) return json({ error: 'invalid_input' }, 400);

  // No key = no send. Say so plainly rather than showing a success the message never had.
  if (!env.RESEND_API_KEY) {
    return json({ error: 'unavailable', message: `We can't take messages right now — please email ${TEAM} directly.` }, 503);
  }

  const to = env.CONTACT_TO || TEAM;
  const notifyFrom = env.NOTIFY_FROM || `OpenFootLab <notifications@openfootlab.com>`;
  const confirmFrom = env.CONFIRM_FROM || `OpenFootLab <${TEAM}>`;

  // 1. The enquiry. This one is critical — if it fails, the request fails.
  const sent = await send(env.RESEND_API_KEY, {
    from: notifyFrom,
    to: [to],
    reply_to: email,
    subject: `New enquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Dealing with: ${dealing || '-'}`,
      '',
      message,
      '',
      '— openfootlab.com contact form',
    ].join('\n'),
  });
  if (!sent.ok) {
    return json({ error: 'send_failed', message: `Something hiccuped — please email ${TEAM} and we'll answer.` }, 502);
  }

  // 2. The confirmation. Best-effort: the enquiry already reached us, so a failure here
  //    must not tell the sender their message was lost.
  if (env.CONFIRM_OFF !== '1') {
    await send(env.RESEND_API_KEY, {
      from: confirmFrom,
      to: [email],
      reply_to: TEAM,
      subject: 'We got your message — OpenFootLab',
      text: confirmText({ name, dealing, message }),
      html: confirmHtml({ name, dealing, message }),
    }).catch(() => {});
  }

  return json({ ok: true });
}

/* ---------------- the confirmation ---------------- */

function confirmText({ name, dealing, message }) {
  return `${name ? name.split(' ')[0] + ',' : 'Hi,'}

Thanks for writing in. Your message reached us — a real person reads every one, and we'll come back to you within one business day.

If something is changing on your foot right now — a new wound, redness, swelling, drainage, warmth, or anything you can't explain — contact your clinician today. Please don't wait on us. We build the record and the inserts; we don't replace your care team.

What you sent:
${dealing ? `Dealing with: ${dealing}\n` : ''}
${message}

Replying to this email goes straight to ${TEAM}.

— OpenFootLab
Jupiter, FL · Made in the USA
${TEAM} · 561.532.7120
openfootlab.com`;
}

function confirmHtml({ name, dealing, message }) {
  const first = name ? esc(name.split(' ')[0]) + ',' : 'Hi,';
  return `<!doctype html><html><body style="margin:0;background:#0B0F14;padding:28px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:560px;background:#0e141b;border:1px solid #1F2A36;border-radius:10px;">
<tr><td style="padding:26px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#C6D0DB;line-height:1.62;font-size:15px;">

<div style="font-weight:800;font-size:18px;color:#E8EEF5;letter-spacing:-.3px;margin-bottom:22px;">
  <span style="color:#F2B441;">Open</span>FootLab
</div>

<p style="margin:0 0 14px;color:#E8EEF5;">${first}</p>

<p style="margin:0 0 14px;">Thanks for writing in. Your message reached us — a real person reads every one, and we'll come back to you within one business day.</p>

<div style="margin:20px 0;padding:14px 16px;border-left:3px solid #E2524F;background:#121922;">
  <p style="margin:0;color:#E8EEF5;">If something is changing on your foot right now — a new wound, redness, swelling, drainage, warmth, or anything you can't explain — <strong>contact your clinician today.</strong> Please don't wait on us. We build the record and the inserts; we don't replace your care team.</p>
</div>

<p style="margin:22px 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#7E8B99;">What you sent</p>
<div style="padding:14px 16px;background:#121922;border:1px solid #1F2A36;border-radius:6px;">
  ${dealing ? `<p style="margin:0 0 10px;color:#96A2AF;font-size:14px;">Dealing with: <span style="color:#C6D0DB;">${esc(dealing)}</span></p>` : ''}
  <p style="margin:0;white-space:pre-wrap;">${esc(message)}</p>
</div>

<p style="margin:22px 0 0;">Replying to this email goes straight to <a href="mailto:${TEAM}" style="color:#F2B441;">${TEAM}</a>.</p>

<hr style="border:0;border-top:1px solid #1F2A36;margin:24px 0 16px;">
<p style="margin:0;color:#7E8B99;font-size:13px;">
  <strong style="color:#96A2AF;">OpenFootLab</strong><br>
  Jupiter, FL · Made in the USA<br>
  <a href="mailto:${TEAM}" style="color:#7E8B99;">${TEAM}</a> · 561.532.7120<br>
  <a href="https://openfootlab.com" style="color:#7E8B99;">openfootlab.com</a>
</p>

</td></tr></table></td></tr></table></body></html>`;
}

/* ---------------- helpers ---------------- */

async function send(key, payload) {
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { ok: r.ok, status: r.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

const str = (v, n) => String(v ?? '').trim().slice(0, n);
const isEmail = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const onRequestGet = () => json({ ok: true, endpoint: 'contact' });

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
