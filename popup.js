const DEFAULTS = { enabled: true, animated: true, dragon: true };
const keys = Object.keys(DEFAULTS);

function sync(s) {
  for (const k of keys) document.getElementById(k).checked = s[k];
  // the sub-options only matter while the skin is on (and the dragon only while things move)
  document.querySelector('label[for="animated"]').classList.toggle("off", !s.enabled);
  document.querySelector('label[for="dragon"]').classList.toggle("off", !s.enabled || !s.animated);
}

chrome.storage.sync.get(DEFAULTS, s => {
  sync(s);
  for (const k of keys) {
    document.getElementById(k).addEventListener("change", e => {
      s[k] = e.target.checked;
      chrome.storage.sync.set({ [k]: s[k] });
      sync(s);
    });
  }
});

document.getElementById("bg").addEventListener("click", () => chrome.runtime.openOptionsPage());
