(function(){
  "use strict";
  // hover / focus engine — reproduces the design's interactive states without a framework
  function bind(attr, onEvents, offEvents){
    document.querySelectorAll('['+attr+']').forEach(function(el){
      var extra = el.getAttribute(attr); if(!extra) return;
      var base = el.getAttribute('style') || '';
      onEvents.forEach(function(ev){ el.addEventListener(ev, function(){ el.setAttribute('style', base + ';' + extra); }); });
      offEvents.forEach(function(ev){ el.addEventListener(ev, function(){ el.setAttribute('style', base); }); });
    });
  }
  bind('data-hover', ['mouseenter','focus'], ['mouseleave','blur']);
  bind('data-focus', ['focus'], ['blur']);

  // FAQ accordion — single open
  document.querySelectorAll('[data-faq]').forEach(function(root){
    var items = Array.prototype.slice.call(root.querySelectorAll('[data-faq-item]'));
    function setOpen(item, open){
      item.setAttribute('data-open', open ? 'true':'false');
      var a = item.querySelector('[data-faq-a]'); var p = item.querySelector('[data-plus]');
      if(a) a.style.display = open ? 'block':'none';
      if(p){ p.textContent = open ? '\u2212' : '+'; p.style.color = open ? 'var(--accent)' : '#70746B'; }
    }
    items.forEach(function(item){
      var btn = item.querySelector('[data-faq-q]'); if(!btn) return;
      btn.setAttribute('aria-expanded', item.getAttribute('data-open')==='true' ? 'true':'false');
      btn.addEventListener('click', function(){
        var willOpen = item.getAttribute('data-open') !== 'true';
        items.forEach(function(o){ setOpen(o, false); var b=o.querySelector('[data-faq-q]'); if(b) b.setAttribute('aria-expanded','false'); });
        setOpen(item, willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true':'false');
      });
    });
  });

  // Contact form — validation + progressive submit
  document.querySelectorAll('form[data-contact]').forEach(function(form){
    form.addEventListener('submit', function(e){
      var name = form.querySelector('[name=name]');
      var email = form.querySelector('[name=email]');
      var message = form.querySelector('[name=message]');
      var ok = true;
      function setErr(field, msg){ var s=form.querySelector('[data-err='+field+']'); if(s){ s.textContent=msg||''; s.style.display=msg?'block':'none'; } if(msg) ok=false; }
      setErr('name', name && name.value.trim() ? '' : 'Please enter your name.');
      setErr('email', email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim()) ? '' : 'Please enter a valid email.');
      setErr('message', message && message.value.trim() ? '' : 'Please add a short message.');
      e.preventDefault();
      if(!ok) return;
      var success = form.parentElement.querySelector('[data-success]');
      var endpoint = form.getAttribute('action') || '';
      var payload = { name:name.value.trim(), email:email.value.trim(), dealing:(form.querySelector('[name=dealing]')||{}).value||'', message:message.value.trim() };
      function done(){ form.style.display='none'; if(success) success.style.display='block'; }
      var btn = form.querySelector('button[type=submit]'); if(btn){ btn.disabled=true; btn.textContent='Sending…'; }
      if(endpoint && endpoint.indexOf('mailto:')!==0){
        fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
          .then(function(){ done(); })
          .catch(function(){ done(); });
      } else { done(); }
    });
  });
})();

  // Newsletter — double opt-in. Submitting sends a confirmation link; it does
  // not subscribe. The status line tells the truth either way, including the
  // failure, because a sign-up that silently drops an address is worse than
  // one that admits it is down.
  document.querySelectorAll('form[data-subscribe]').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var status = form.querySelector('[data-subscribe-status]');
      var btn = form.querySelector('button[type=submit]');
      var email = (form.querySelector('input[name=email]') || {}).value || '';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
        if (status) status.textContent = 'That email address does not look right.';
        return;
      }
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      if (status) status.textContent = '';
      fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), company: (form.querySelector('input[name=company]')||{}).value || '' })
      }).then(function(r){ return r.json().then(function(d){ return { ok: r.ok, d: d }; }); })
        .then(function(res){
          if (res.ok && res.d && res.d.ok) {
            if (status) status.textContent = 'Check your inbox — we sent a confirmation link. You are not on the list until you click it.';
            form.querySelector('input[name=email]').value = '';
          } else {
            if (status) status.textContent = (res.d && res.d.message) || 'That did not go through. Please try again, or email care@openfootlab.com.';
          }
        })
        .catch(function(){
          if (status) status.textContent = 'That did not go through. Please try again, or email care@openfootlab.com.';
        })
        .then(function(){ if (btn) { btn.disabled = false; btn.textContent = 'Sign up'; } });
    });
  });
