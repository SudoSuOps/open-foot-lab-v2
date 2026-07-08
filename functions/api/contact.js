// POST /api/contact -> Resend email to build@openfootlab.com. env: RESEND_API_KEY (CF Pages).
const json=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{"Content-Type":"application/json"}});
const clean=(v,n)=>String(v??"").trim().slice(0,n);
const okEmail=e=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
export async function onRequestPost({request,env}){
  let d; try{d=await request.json();}catch{return json({error:"bad request"},400);}
  if(d.company) return json({ok:true});                 // honeypot
  const name=clean(d.name,120), email=clean(d.email,160), role=clean(d.role,60)||"Not specified", message=clean(d.message,4000);
  if(!okEmail(email)||message.length<2) return json({error:"Please add a valid email and a short note."},400);
  if(!env.RESEND_API_KEY) return json({error:"Email build@openfootlab.com — form not live yet."},500);
  const r=await fetch("https://api.resend.com/emails",{method:"POST",
    headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,"Content-Type":"application/json"},
    body:JSON.stringify({from:"OpenFootLab <build@openfootlab.com>",to:[env.CONTACT_TO||"build@openfootlab.com"],reply_to:email,
      subject:`[OpenFootLab] ${role} — ${name||email}`,text:`New message from openfootlab.com\n\nName: ${name}\nEmail: ${email}\nRole: ${role}\n\n${message}`})});
  if(!r.ok) return json({error:"Something hiccuped — email build@openfootlab.com."},502);
  return json({ok:true});
}
