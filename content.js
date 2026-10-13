// Frostpeak Mail — content script for mail.google.com.
// Adds html.frostpeak (which switches skin.css on), loads the bundled fonts,
// paints the misty-mountain sky behind Gmail, and swaps the "sent" toast for a courier banner.

const DEFAULTS = { enabled: true, animated: true, dragon: true, dim: .35 };
let settings = { ...DEFAULTS };

/* ---------- fonts ---------- */
// Loaded through the FontFace API from bytes, so Gmail's font-src policy can't block them.
const FONT_FILES = [
  ["Frostpeak Barlow", "barlow-300", "300"],
  ["Frostpeak Barlow", "barlow-400", "400"],
  ["Frostpeak Barlow", "barlow-500", "500"],
  ["Frostpeak Cinzel", "cinzel", "500"],
  ["Frostpeak Reading", "barlow-semi-400", "400"],
  ["Frostpeak Reading", "barlow-semi-500", "500"],
  ["Frostpeak Reading", "barlow-semi-600", "600 900"],   // real semibold, also serves bold, so the browser never fakes it
  ["Frostpeak Barlow", "barlow-600", "600 900"],
];
const LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT = "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF";

async function loadFonts() {
  const jobs = [];
  for (const [family, file, weight] of FONT_FILES) {
    for (const [suffix, range] of [["latin", LATIN], ["latin-ext", LATIN_EXT]]) {
      jobs.push((async () => {
        const buf = await (await fetch(chrome.runtime.getURL(`fonts/${file}-${suffix}.woff2`))).arrayBuffer();
        const face = new FontFace(family, buf, { weight, unicodeRange: range, display: "swap" });
        await face.load();
        document.fonts.add(face);
      })().catch(err => console.warn("[Frostpeak Mail] font failed", file, suffix, err)));
    }
  }
  await Promise.all(jobs);
}

/* ---------- the sky ---------- */
let cv, cx, W, H, land, rand, raf = 0, lastFrame = 0;
const seeded = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

function ridge(g, base, amp, rough, color, trees) {
  let y = [];
  for (let i = 0; i <= 9; i++) y.push(base + (rand() - .5) * amp);
  for (let pass = 0, a = amp * .5; pass < 5; pass++, a *= rough) {   // midpoint displacement → craggy peaks
    const ny = [];
    for (let i = 0; i < y.length - 1; i++) ny.push(y[i], (y[i] + y[i + 1]) / 2 + (rand() - .5) * a);
    ny.push(y[y.length - 1]); y = ny;
  }
  g.fillStyle = color; g.beginPath(); g.moveTo(0, H);
  y.forEach((v, i) => g.lineTo(i / (y.length - 1) * W, v));
  g.lineTo(W, H); g.closePath(); g.fill();
  if (!trees) return;
  for (let x = 0; x < W; x += trees * (.5 + rand())) {               // pine silhouettes along the ridge
    const top = y[Math.round(x / W * (y.length - 1))];
    const h = trees * (2 + rand() * 3.5), w = h * .32;
    g.beginPath(); g.moveTo(x, top - h);
    for (let k = 1; k <= 4; k++) { g.lineTo(x + w * k / 4, top - h + h * k / 4.3); g.lineTo(x + w * k / 9, top - h + h * k / 4.3); }
    g.lineTo(x, top + 4);
    for (let k = 4; k >= 1; k--) { g.lineTo(x - w * k / 9, top - h + h * k / 4.3); g.lineTo(x - w * k / 4, top - h + h * k / 4.3); }
    g.closePath(); g.fill();
  }
}

// The user's own wallpaper, if they picked one on the options page. It lives only in chrome.storage.local.
// Decoded from bytes so Gmail's img-src policy can't block it.
let photo = null;
async function setPhoto(dataUrl) {
  photo = null;
  if (dataUrl) {
    try {
      const [head, b64] = dataUrl.split(",");
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
      photo = await createImageBitmap(new Blob([bytes], { type: head.slice(5, head.indexOf(";")) }));
    } catch (err) { console.warn("[Frostpeak Mail] background image failed", err); }
  }
  if (cv) { paintLand(); restartSky(); }
}

function paintLand() {
  rand = seeded(1337);
  land = document.createElement("canvas"); land.width = W; land.height = H;
  const g = land.getContext("2d");
  if (photo) {                                   // cover-fit the wallpaper, centred
    const k = Math.max(W / photo.width, H / photo.height);
    g.drawImage(photo, (W - photo.width * k) / 2, (H - photo.height * k) / 2, photo.width * k, photo.height * k);
    return;
  }
  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#1b1e1f"); sky.addColorStop(.45, "#34393a"); sky.addColorStop(.7, "#262a2b"); sky.addColorStop(1, "#0e1011");
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  const moon = g.createRadialGradient(W * .62, H * .3, 0, W * .62, H * .3, H * .55);
  moon.addColorStop(0, "rgba(190,195,190,.22)"); moon.addColorStop(1, "rgba(190,195,190,0)");
  g.fillStyle = moon; g.fillRect(0, 0, W, H);
  ridge(g, H * .46, H * .3, .58, "#3c4241", 0);
  ridge(g, H * .55, H * .28, .55, "#2e3332", 0);
  const haze = g.createLinearGradient(0, H * .45, 0, H * .8);
  haze.addColorStop(0, "rgba(90,96,94,0)"); haze.addColorStop(1, "rgba(90,96,94,.35)");
  g.fillStyle = haze; g.fillRect(0, 0, W, H);
  ridge(g, H * .7, H * .16, .5, "#202424", Math.max(8, W / 140));
  ridge(g, H * .82, H * .1, .5, "#151818", Math.max(12, W / 90));
  ridge(g, H * .95, H * .06, .45, "#0b0d0d", Math.max(18, W / 60));
}

/* ---------- the dragon ---------- */
// Drawn in its own coordinates, head toward +x, about 300 units nose to tail.
// Each wing point is (x along the body, s out along the span). The flap angle swings the span around
// the body axis and a fixed camera tilt projects it, so the near and far wings separate like real 3D.
const WING = {
  lead: [[16, 0], [0, 48], [30, 96], [-4, 215]],                     // shoulder → elbow → wrist → longest fingertip
  tips: [[-4, 215], [-58, 180], [-100, 128], [-118, 66], [-40, 0]],  // fingertips back to the hip
};
const TILT = 0.85;   // camera a little below the dragon, so a glide shows both wings spread

function wingbeat(t) {
  // ~9s cycle: three heavy beats, then a long glide with the wings held in a shallow V
  const cycle = 9000, beatLen = 1150, beats = 3, c = t % cycle, glide = 0.16;
  if (c >= beats * beatLen) return { phi: glide, fold: 1, lift: 0 };
  const ph = c / beatLen * Math.PI * 2;
  const env = Math.sqrt(Math.sin(c / (beats * beatLen) * Math.PI));   // ease into and out of the beats
  return {
    phi: glide + 0.8 * Math.sin(ph) * env,
    fold: 1 - 0.22 * Math.max(0, Math.cos(ph)) * env,   // wings half-fold on the upstroke
    lift: -Math.cos(ph) * 3 * env,                      // body rises on the downstroke
  };
}

function wingPoint([x, s], side, phi, fold) {
  s *= fold;
  const y = -s * Math.sin(phi), z = side * s * Math.cos(phi);
  return [x, -6 + y * Math.cos(TILT) + z * Math.sin(TILT)];
}

function drawWing(side, phi, fold) {
  const L = WING.lead.map(p => wingPoint(p, side, phi, fold));
  const T = WING.tips.map(p => wingPoint(p, side, phi, fold));
  const [wx, wy] = L[2];
  cx.beginPath(); cx.moveTo(...L[0]);
  for (let i = 1; i < L.length; i++) cx.lineTo(...L[i]);
  for (let i = 1; i < T.length; i++) {          // membrane sags toward the wrist between each finger
    const [ax, ay] = T[i - 1], [bx, by] = T[i], mx = (ax + bx) / 2, my = (ay + by) / 2;
    cx.quadraticCurveTo(mx + (wx - mx) * .3, my + (wy - my) * .3, bx, by);
  }
  cx.closePath(); cx.fill();
  cx.beginPath(); cx.moveTo(wx, wy); cx.lineTo(wx + 9, wy - 2 * side); cx.stroke();   // thumb claw
}

function drawBody(t) {
  const wave = t / 420, top = [], bot = [];
  let endY = 0;
  for (let i = 0; i <= 24; i++) {               // tail: a tapered ribbon with a slow travelling wave
    const u = i / 24, x = -24 - u * 120, y = Math.sin(wave - u * 4) * 8 * u + u * 5, w = 7 * (1 - u) + .8;
    top.push([x, y - w]); bot.push([x, y + w]); endY = y;
  }
  cx.beginPath();
  cx.moveTo(-24, -7);
  cx.bezierCurveTo(0, -17, 30, -15, 46, -9);    // back
  cx.bezierCurveTo(64, -6, 78, -16, 92, -20);   // neck rising
  cx.lineTo(101, -23); cx.lineTo(114, -19); cx.lineTo(119, -16);   // skull and snout
  cx.lineTo(105, -12);                          // jaw
  cx.bezierCurveTo(86, -10, 70, 0, 50, 6);      // throat
  cx.bezierCurveTo(30, 15, 0, 16, -24, 7);      // belly
  for (const p of bot) cx.lineTo(...p);
  cx.lineTo(-152, endY + 5); cx.lineTo(-162, endY); cx.lineTo(-152, endY - 6);   // tail spade
  for (const p of top.reverse()) cx.lineTo(...p);
  cx.closePath(); cx.fill();
  cx.beginPath();                               // horns swept back
  cx.moveTo(100, -22); cx.quadraticCurveTo(92, -31, 82, -32);
  cx.moveTo(105, -21); cx.quadraticCurveTo(98, -33, 88, -37);
  cx.stroke();
  cx.beginPath();                               // legs tucked under for flight
  cx.moveTo(-6, 10); cx.quadraticCurveTo(-18, 22, -34, 19); cx.lineTo(-31, 15); cx.quadraticCurveTo(-18, 15, -12, 6);
  cx.moveTo(30, 9); cx.quadraticCurveTo(26, 19, 15, 21); cx.lineTo(17, 17); cx.quadraticCurveTo(22, 13, 22, 8);
  cx.fill();
}

function drawDragon(t) {
  const period = 70000, pass = 26000, c = t % period;   // one unhurried crossing every ~70s
  if (c > pass) return;
  const pos = k => [W * (1.15 - k * 1.3), H * (.16 + .06 * Math.sin(k * Math.PI * 1.3) + k * .06)];
  const k = c / pass, [x, y] = pos(k), [nx, ny] = pos(k + .005);
  const heading = Math.atan2(ny - y, nx - x);
  const { phi, fold, lift } = wingbeat(t);
  const s = Math.min(W, H) / 1900 * (1.15 - k * .35);  // shrinks a little as it flies off into the distance
  cx.save();
  cx.translate(x, y);
  cx.rotate(heading + Math.PI + Math.sin(t / 1700) * .03);
  cx.scale(-s, s);
  cx.translate(0, -lift * 3);
  cx.filter = "blur(0.5px)";
  cx.lineWidth = 2.2; cx.lineCap = "round"; cx.lineJoin = "round";
  cx.fillStyle = cx.strokeStyle = "rgba(24,27,28,.92)";  // far wing: a shade lighter, it's further away
  drawWing(-1, phi, fold);
  cx.fillStyle = cx.strokeStyle = "rgba(15,17,18,.94)";
  drawBody(t);
  drawWing(1, phi, fold);
  cx.restore();
}

function drawFog(t) {
  for (let i = 0; i < 3; i++) {
    const y = H * (.6 + i * .12), drift = (t / (90 + i * 40)) % W;
    for (const off of [-W, 0]) {
      const x = drift + off;
      const g = cx.createRadialGradient(x + W * .5, y, 0, x + W * .5, y, W * .6);
      g.addColorStop(0, `rgba(120,126,124,${.07 - i * .015})`); g.addColorStop(1, "rgba(120,126,124,0)");
      cx.fillStyle = g; cx.fillRect(x, y - H * .2, W, H * .4);
    }
  }
}

const moving = () => settings.enabled && settings.animated && !reducedMotion.matches;

function frame(t) {
  raf = 0;
  if (!land) return;
  cx.drawImage(land, 0, 0);
  if (moving() && settings.dragon) drawDragon(t + 65000);
  drawFog(moving() ? t : 0);
  cx.fillStyle = `rgba(0,0,0,${settings.dim})`; cx.fillRect(0, 0, W, H);   // dim so Gmail text stays legible
  if (moving()) raf = requestAnimationFrame(tick);
}
function tick(t) {            // cap at ~30fps; the fog is slow, Gmail deserves the CPU
  if (t - lastFrame < 33) { raf = requestAnimationFrame(tick); return; }
  lastFrame = t; frame(t);
}
function restartSky() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  if (settings.enabled) frame(performance.now());
}

function resize() {
  if (!cv) return;
  W = cv.width = innerWidth; H = cv.height = innerHeight;   // 1x resolution: soft fog doesn't need retina pixels
  paintLand(); restartSky();
}

function mountSky() {
  if (cv) return;
  cv = document.createElement("canvas");
  cv.id = "frostpeak-sky"; cv.setAttribute("aria-hidden", "true");
  document.documentElement.prepend(cv);
  cx = cv.getContext("2d");
  let pending;
  addEventListener("resize", () => { clearTimeout(pending); pending = setTimeout(resize, 150); });
  reducedMotion.addEventListener("change", restartSky);
  resize();
}

/* ---------- courier banner instead of "Message sent" ---------- */
// Gmail's "sent" toast in the languages we recognise; anything else simply keeps Gmail's own toast
const SENT = /(message sent|ileti gönderildi|mesaj gönderildi|e-posta gönderildi|nachricht gesendet|mensaje enviado|message envoyé|mensagem enviada|messaggio inviato)/i;
let toast, toastTimer, lastSeen = "";
function courier(msg) {
  if (!toast) { toast = document.createElement("div"); toast.id = "frostpeak-toast"; toast.setAttribute("role", "status"); document.body.append(toast); }
  toast.textContent = msg; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function watchAlerts() {
  new MutationObserver(() => {
    if (!settings.enabled) return;
    const alert = document.querySelector('[role="alert"]');
    const text = alert?.textContent?.trim() || "";
    if (text && text !== lastSeen && SENT.test(text)) courier(chrome.i18n.getMessage("toastSent") || "A courier has been dispatched");
    lastSeen = text;
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
}

/* ---------- safety net: catch light boxes the stylesheet doesn't know about ---------- */
// Gmail keeps adding panels under new class names (translate bar, banners, chips...). Instead of
// chasing each one, look at elements as they appear and flag anything still painted light, or dark
// text that would vanish on the dark glass. skin.css styles the flags. Mail bodies are left alone,
// since HTML newsletters are designed for their own white backgrounds.
const seen = new WeakSet();
function luma(css) {
  const m = css.match(/[\d.]+/g);
  if (!m) return null;
  const [r, g, b, a = 1] = m.map(Number);
  return { l: (.2126 * r + .7152 * g + .0722 * b) / 255, a };
}
// Mail bodies get one of two treatments:
//   "paper": the mail brings its own light background (newsletters, receipts) → shown on parchment, colors untouched
//   "plain": plain text or no background → bone-white text, dark inline colors lifted
function classifyMail(m) {
  const w = m.offsetWidth;
  if (!w) return;                                   // not laid out yet; the next scan will try again
  const all = m.querySelectorAll("*");
  let paper = false;
  for (const el of all) {
    const bg = luma(getComputedStyle(el).backgroundColor);
    if (bg && bg.a > .5 && bg.l > .6 && el.offsetWidth > w * .5) { paper = true; break; }
  }
  m.setAttribute("data-fp-mail", paper ? "paper" : "plain");
  if (!paper) for (const el of all) {
    const fg = luma(getComputedStyle(el).color);
    if (fg && fg.l < .45) el.setAttribute("data-fp-ink", "");
  }
}

function scan() {
  if (!settings.enabled) return;
  for (const m of document.querySelectorAll(".a3s:not([data-fp-mail])")) classifyMail(m);
  for (const el of document.body.getElementsByTagName("*")) {
    if (seen.has(el)) continue;
    seen.add(el);
    if (el.closest(".a3s, svg, #frostpeak-toast")) continue;
    const cs = getComputedStyle(el);
    const bg = luma(cs.backgroundColor);
    if (bg && bg.a > .5 && bg.l > .75) {
      if (el.offsetWidth > 40 && el.offsetHeight > 24) el.setAttribute("data-fp-dark", "");   // panels go dark
      else if (isBadge(el)) el.setAttribute("data-fp-chip", "");                             // "11 yeni" badges
      // anything else small and light (label colour dots, avatars) keeps its own look
      continue;
    }
    const fg = luma(cs.color);
    if (fg && fg.l < .3 && el.firstChild?.nodeType === Node.TEXT_NODE && el.firstChild.data.trim() && !onLight(el)) {
      el.setAttribute("data-fp-ink", "");
    }
  }
}
// A badge is a small, settled box holding a few words of its own text: not an icon, not a container,
// and not something caught mid-animation (those have no text node of their own).
function isBadge(el) {
  const own = [...el.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.data.trim());
  const text = el.textContent.trim();
  return own && text.length > 0 && text.length <= 24 && el.children.length <= 1 && el.offsetHeight > 8 && el.offsetHeight <= 24;
}
// Is the first opaque background behind this element light? Then its dark text is meant to be there.
function onLight(el) {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    const bg = luma(getComputedStyle(p).backgroundColor);
    if (bg && bg.a > .5) return bg.l > .6;
  }
  return false;
}
let scanTimer;
const idle = window.requestIdleCallback || (cb => setTimeout(cb, 0));
function queueScan() { clearTimeout(scanTimer); scanTimer = setTimeout(() => idle(scan), 300); }
function watchLightBoxes() {
  new MutationObserver(queueScan).observe(document.body, { childList: true, subtree: true });
  queueScan();
}

/* ---------- settings ---------- */
function apply() {
  document.documentElement.classList.toggle("frostpeak", settings.enabled);
  restartSky();
}
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") { if ("bgImage" in changes) setPhoto(changes.bgImage.newValue); return; }
  if (area !== "sync") return;
  for (const [k, { newValue }] of Object.entries(changes)) if (k in DEFAULTS) settings[k] = newValue;
  apply();
});

/* ---------- boot ---------- */
document.documentElement.classList.add("frostpeak");   // assume on until storage answers, avoids a white flash
chrome.storage.sync.get(DEFAULTS, s => { settings = s; apply(); });
chrome.storage.local.get("bgImage", r => { if (r.bgImage) setPhoto(r.bgImage); });
loadFonts();
const boot = () => { mountSky(); watchAlerts(); watchLightBoxes(); };
if (document.body) boot(); else addEventListener("DOMContentLoaded", boot, { once: true });
