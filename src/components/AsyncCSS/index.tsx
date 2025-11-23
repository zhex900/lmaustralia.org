import Script from 'next/script'

export function AsyncCSS() {
  return (
    <Script
      id="async-css-loader"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  // Function to make CSS non-blocking
  function makeCSSAsync() {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var href = link.getAttribute('href');
      if (href && (href.includes('_next') || href.includes('app'))) {
        // Use media="print" trick to load CSS asynchronously
        link.setAttribute('media', 'print');
        link.onload = function() {
          this.media = 'all';
        };
      }
    }
  }
  
  // Run immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', makeCSSAsync);
  } else {
    makeCSSAsync();
  }
  
  // Also run after a short delay to catch any dynamically added stylesheets
  setTimeout(makeCSSAsync, 100);
})();
        `,
      }}
    />
  )
}
