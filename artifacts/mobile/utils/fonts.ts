// Web fallback: inject Google Fonts CSS for Plus Jakarta Sans,
// then return an empty map so useFonts doesn't trigger FontFaceObserver timeouts.
if (typeof document !== 'undefined') {
  const id = 'plus-jakarta-sans-css';
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);

    // Inject a <style> that maps the RN font-family names to the web font
    const style = document.createElement('style');
    style.textContent = `
      * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important; }
    `;
    document.head.appendChild(style);
  }
}

export const fontMap: Record<string, unknown> = {};
