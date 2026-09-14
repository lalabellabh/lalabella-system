/* Lalabella module compatibility loader.
 * Keeps relocated module pages compatible with the existing root application.
 */
(function(){
  /* Load the real root auth guard before the rest of the module parses. */
  document.write('<script src="../../auth-guard.js"><\/script>');
  /* The copied pages still use the original root-relative URL assumptions. */
  document.write('<base href="../../">');

  // Exact flat-filename -> real modules/xxx/ location map. Lets every
  // link resolve DIRECTLY to its final destination instead of
  // bouncing through the root stub first (stub -> modules/xxx/ was a
  // correct but slower two-hop path; this skips the extra hop).
  // Anything NOT in this map (e.g. index.html itself, which stays at
  // the real root) still falls back to plain root-relative resolution.
  const FILE_MAP = {
    'branch-config.html': 'modules/admin/branch-config.html',
    'card-print.html': 'modules/printing/card-print.html',
    'chatbox.html': 'modules/assistant/chatbox.html',
    'chocolate-admin.html': 'modules/chocolate/chocolate-admin.html',
    'chocolate-barcode.html': 'modules/chocolate/chocolate-barcode.html',
    'chocolate-calc.html': 'modules/chocolate/chocolate-calc.html',
    'chocolate-guide.html': 'modules/chocolate/chocolate-guide.html',
    'chocolate-odoo-import.html': 'modules/chocolate/chocolate-odoo-import.html',
    'chocolate-receiving.html': 'modules/chocolate/chocolate-receiving.html',
    'chocolate-release.html': 'modules/chocolate/chocolate-release.html',
    'dashboard.html': 'modules/dashboard/dashboard.html',
    'flower-admin.html': 'modules/flower/flower-admin.html',
    'flower-barcode.html': 'modules/flower/flower-barcode.html',
    'flower-calc.html': 'modules/flower/flower-calc.html',
    'flower-catalog.html': 'modules/flower/flower-catalog.html',
    'flower-dashboard.html': 'modules/flower/flower-dashboard.html',
    'flower-guide.html': 'modules/flower/flower-guide.html',
    'flower-odoo-import.html': 'modules/flower/flower-odoo-import.html',
    'flower-purchase.html': 'modules/flower/flower-purchase.html',
    'flower-receiving.html': 'modules/flower/flower-receiving.html',
    'flower-stock-count.html': 'modules/flower/flower-stock-count.html',
    'flower-tools.html': 'modules/flower/flower-tools.html',
    'flower-transfer.html': 'modules/flower/flower-transfer.html',
    'initial-stock.html': 'modules/inventory/initial-stock.html',
    'item-admin.html': 'modules/inventory/item-admin.html',
    'item-dashboard.html': 'modules/inventory/item-dashboard.html',
    'item-inventory.html': 'modules/inventory/item-inventory.html',
    'item-odoo-import.html': 'modules/inventory/item-odoo-import.html',
    'notes.html': 'modules/admin/notes.html',
    'nova-command-center.html': 'modules/assistant/nova-command-center.html',
    'order-form.html': 'modules/orders/order-form.html',
    'profile.html': 'modules/admin/profile.html',
    'schedule.html': 'modules/admin/schedule.html',
    'stock-approval.html': 'modules/inventory/stock-approval.html',
    'stock-count.html': 'modules/inventory/stock-count.html',
    'supply-log.html': 'modules/inventory/supply-log.html'
  };

  function normalizeLink(a){
    if(!a) return;
    const raw=a.getAttribute('href') || '';
    if(!raw || raw[0]==='#' || /^(?:[a-z]+:|\/\/)/i.test(raw)) return;
    try{
      // Split off any query string / hash so the lookup matches on
      // the bare filename, then re-attach it to whichever target URL
      // we resolve to.
      const hashIdx = raw.indexOf('#');
      const qIdx = raw.indexOf('?');
      const cutIdx = [hashIdx, qIdx].filter(i => i !== -1).sort((a,b)=>a-b)[0];
      const bareFile = (cutIdx === undefined ? raw : raw.slice(0, cutIdx)).split('/').pop();
      const suffix = cutIdx === undefined ? '' : raw.slice(cutIdx);

      const target = FILE_MAP[bareFile];
      const resolved = target
        ? new URL(target + suffix, document.baseURI)   // direct to modules/xxx/file.html
        : new URL(raw, document.baseURI);               // fallback: old root-relative behavior

      if(resolved.origin===location.origin && /\.html(?:$|[?#])/i.test(resolved.pathname)){
        a.setAttribute('href', resolved.href);
      }
    }catch(_){ }
  }

  document.addEventListener('click', function(e){
    const a=e.target && e.target.closest ? e.target.closest('a[href]') : null;
    normalizeLink(a);
  }, true);

  /* Some module pages open their active <a> from a keyboard handler. */
  document.addEventListener('keydown', function(e){
    if(e.key!=='Enter') return;
    const active=document.querySelector('a.tool.active, a[aria-current="page"], a:focus');
    normalizeLink(active);
  }, true);

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a[href]').forEach(normalizeLink);
    document.querySelectorAll('[onclick]').forEach(function(el){
      const raw=el.getAttribute('onclick') || '';
      if(raw.includes("window.location.href='index.html'") || raw.includes('window.location.href="index.html"')){
        el.setAttribute('onclick', raw
          .replace("window.location.href='index.html'", "window.location.href=new URL('index.html',document.baseURI).href")
          .replace('window.location.href="index.html"', "window.location.href=new URL('index.html',document.baseURI).href"));
      }
    });
  });
})();
