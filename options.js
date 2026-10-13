const $ = s => document.querySelector(s);
const stage = $("#stage"), status = $("#status");
const MAX_W = 2560;

function say(msg, err = false) { status.textContent = msg; status.classList.toggle("err", err); }

function show(dataUrl) {
  stage.style.backgroundImage = dataUrl ? `url("${dataUrl}")` : "";
  stage.classList.toggle("has", !!dataUrl);
  $("#clear").disabled = !dataUrl;
}

// Shrink to at most 2560px wide and re-encode as JPEG so it fits comfortably in extension storage.
async function encode(file) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, MAX_W / bmp.width);
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", .88);
}

async function use(file) {
  if (!file || !file.type.startsWith("image/")) return say("Bu bir resim dosyası değil. JPG, PNG veya WebP seç.", true);
  say("Hazırlanıyor…");
  try {
    const dataUrl = await encode(file);
    await chrome.storage.local.set({ bgImage: dataUrl });
    show(dataUrl);
    say(`Kaydedildi (${(dataUrl.length / 1048576).toFixed(1)} MB). Açık Gmail sekmeleri hemen güncellenir.`);
  } catch (err) {
    say("Resim kaydedilemedi: " + err.message, true);
  }
}

const pick = () => $("#file").click();
$("#pick").addEventListener("click", pick);
stage.addEventListener("click", pick);
stage.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
$("#file").addEventListener("change", e => { use(e.target.files[0]); e.target.value = ""; });

stage.addEventListener("dragover", e => { e.preventDefault(); stage.classList.add("drag"); });
stage.addEventListener("dragleave", () => stage.classList.remove("drag"));
stage.addEventListener("drop", e => { e.preventDefault(); stage.classList.remove("drag"); use(e.dataTransfer.files[0]); });

$("#clear").addEventListener("click", async () => {
  await chrome.storage.local.remove("bgImage");
  show(null); say("Resim kaldırıldı. Çizilen dağ manzarası geri geldi.");
});

const dim = $("#dim"), dimOut = $("#dimOut");
function showDim(v) { dimOut.textContent = Math.round(v * 100) + "%"; stage.style.setProperty("--dim", v); }
chrome.storage.sync.get({ dim: .35 }, s => { dim.value = s.dim; showDim(s.dim); });
dim.addEventListener("input", () => { const v = +dim.value; showDim(v); chrome.storage.sync.set({ dim: v }); });

chrome.storage.local.get("bgImage", r => show(r.bgImage || null));
