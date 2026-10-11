// Independent startup fail-safe: even if an app script throws, never leave a blank page.
// Lives in its own file because the CSP (public/_headers) allows no inline scripts or
// inline event handlers. As an inline <script> it was blocked and never ran.
setTimeout(function(){
  var gate=document.getElementById('auth-gate');
  var view=document.getElementById('app-view');
  if(gate && view && !gate.textContent.trim() && !view.textContent.trim()){
    gate.innerHTML='<div class="auth-backdrop"><section class="auth-card"><div class="auth-art"><div class="auth-logo"><img src="./assets/mx-logo.png" alt="" aria-hidden="true"></div><h1>MathsExpress</h1><p>The app files opened, but startup did not finish.</p></div><div class="auth-forms"><h2>Startup recovery</h2><p>Reload this page. If it still appears, clear this site\'s data in your browser settings and try again.</p><button class="btn primary auth-submit" type="button" data-failsafe-reload>Reload MathsExpress</button></div></section></div>';
    var button=gate.querySelector('[data-failsafe-reload]');
    if(button) button.addEventListener('click',function(){ location.reload(); });
  }
},1800);
