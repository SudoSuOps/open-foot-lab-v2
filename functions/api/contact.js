// Cloudflare Pages Function — POST /api/contact
// Sends the contact form to build@openfootlab.com.
// Configure a provider by setting environment variables in the Pages project:
//   RESEND_API_KEY  (create at resend.com; verify the openfootlab.com domain)
//   CONTACT_TO      (default build@openfootlab.com)
//   CONTACT_FROM    (default "OpenFootLab <build@openfootlab.com>")
// Without RESEND_API_KEY the endpoint still returns { ok:true } so the UI succeeds,
// but no email is sent — set the key before launch.

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const data = await request.json();
    const name = (data.name || '').toString().trim();
    const email = (data.email || '').toString().trim();
    const dealing = (data.dealing || '').toString().trim();
    const message = (data.message || '').toString().trim();

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !message) {
      return json({ error: 'invalid_input' }, 400);
    }

    if (env.RESEND_API_KEY) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + env.RESEND_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM || 'OpenFootLab <build@openfootlab.com>',
          to: [env.CONTACT_TO || 'build@openfootlab.com'],
          reply_to: email,
          subject: 'New enquiry from ' + name,
          text: 'Name: ' + name + '\nEmail: ' + email + '\nDealing with: ' + (dealing || '-') + '\n\n' + message
        })
      });
      if (!r.ok) return json({ error: 'send_failed' }, 502);
    }

    return json({ ok: true });
  } catch (e) {
    return json({ error: 'bad_request' }, 400);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
