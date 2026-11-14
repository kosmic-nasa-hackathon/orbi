// Runs before the app bundle so the first paint already uses the right theme.
// Keep the key and colours in sync with src/theme/theme.ts.
(() => {
  let theme = "dark";
  try {
    const stored = localStorage.getItem("orbi-theme");
    if (stored === "dark" || stored === "light") {
      theme = stored;
    } else if (window.matchMedia?.("(prefers-color-scheme: light)").matches) {
      theme = "light";
    }
  } catch {
    // Storage blocked: keep the dark fallback.
  }
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#eef4f7" : "#04070b");
})();
