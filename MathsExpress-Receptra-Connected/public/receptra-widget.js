/*
 * Receptra support chat on the public MathsExpress landing page only.
 * To turn off the launcher, change WIDGET_ENABLED to false and redeploy.
 * The public widget key is an identifier, NOT a Groq or Supabase secret.
 * Do not include this script on app.html or pages with student data.
 */
(() => {
  'use strict';
  const WIDGET_ENABLED = true;
  const EXPECTED_HOST = 'mathsexpress.aarush-sharma6.workers.dev';
  const SCRIPT_URL = 'https://receptra-staging.aarush-sharma6.workers.dev/widget.js';
  const PUBLIC_WIDGET_KEY = 'pk_ce260ad7ed8e43b69f8be0c384745306ed9f';

  // Avoid showing third-party chat on local previews or other deployments.
  if (!WIDGET_ENABLED || window.location.hostname !== EXPECTED_HOST) return;
  // Avoid multiple launcher instances if the script is accidentally loaded twice.
  if (document.querySelector('script[data-receptra-key]')) return;

  const script = document.createElement('script');
  script.src = SCRIPT_URL;
  script.setAttribute('data-receptra-key', PUBLIC_WIDGET_KEY);
  script.async = true;
  script.referrerPolicy = 'strict-origin';
  document.head.appendChild(script);
})();
