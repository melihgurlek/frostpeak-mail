# Frostpeak Mail

A dark Nordic-fantasy theme for Gmail. Misty mountains and pine forests drawn behind your inbox, slow drifting fog, a dragon that crosses the sky now and then, framed menu buttons, and "A courier has been dispatched" when you send a mail.

It runs only in your browser, only on `mail.google.com`. It doesn't read your mail for anything other than styling it, and it sends nothing anywhere. Its only permission is `storage`, used to remember your settings and your optional background image.

*Türkçe özet aşağıda.*

## Install (developer mode)

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and choose this folder.
4. Reload your Gmail tab.

## Recommended Gmail settings

- **Theme → Dark** (Settings ⚙ → Theme). Anything the skin doesn't reach stays dark too.
- **Reading pane → Right of inbox** (Settings ⚙ → Reading pane). Folders, list and message sit side by side.

## Settings

Click the toolbar icon:

- **Theme on** switches the whole skin on or off instantly
- **Moving fog** off keeps the landscape still and uses no CPU
- **Dragon** crosses the sky about every 70 seconds
- **Choose background image…** opens a page where you can use your own wallpaper and set how much it's dimmed

Animation stops by itself when the system asks for reduced motion.

## How the skin stays working

Gmail's class names are obfuscated and change from time to time, so the skin is built in layers:

1. Gmail's own Material 3 color variables (`--gm3-sys-color-*`)
2. Long-lived Gmail class names (`.zA`, `.TO`, `.T-I`, …)
3. ARIA roles as a fallback (`role="main"`, `role="navigation"`, `role="search"`)
4. A safety net in `content.js` that spots light boxes and dark text Gmail adds under unknown names and flags them for the stylesheet

Mail bodies are sorted too: plain-text mail gets light ink on the dark glass, and mail with its own light design (newsletters, receipts) is shown on a parchment sheet with its colors untouched.

## Development

After editing, press ↻ on the extension in `chrome://extensions` and reload Gmail.

To preview the sky and the dragon without Gmail, run `python -m http.server 8765` in this folder and open `http://localhost:8765/dev/sky.html`. Add `#18000` to jump the clock so the dragon is already crossing.

| File | What it does |
| --- | --- |
| `manifest.json` | Extension manifest (MV3) |
| `skin.css` | The whole theme; every rule is scoped under `html.frostpeak` |
| `content.js` | Loads fonts, paints the sky, safety net, courier banner |
| `popup.html`, `popup.js` | Toolbar menu |
| `options.html`, `options.js` | Background image page |
| `i18n.js`, `_locales/` | English and Turkish text |
| `icons/` | Toolbar and store icons, drawn by `tools/make_icons.py` |
| `fonts/` | Barlow Condensed, Barlow Semi Condensed, Cinzel |
| `dev/sky.html` | Sky preview without Gmail |
| `dev/promo.html` | Store promo tile and marquee from the live sky |
| `tools/package.py` | Builds `dist/frostpeak-mail-<version>.zip` for the Chrome Web Store |
| `PRIVACY.md`, `STORE.md` | Privacy policy and the store listing text |

## License

Code: MIT, see [LICENSE](LICENSE). Fonts: SIL Open Font License 1.1, see [fonts/OFL-Barlow.txt](fonts/OFL-Barlow.txt) and [fonts/OFL-Cinzel.txt](fonts/OFL-Cinzel.txt).

Gmail is a trademark of Google LLC. This project is not affiliated with or endorsed by Google.

---

## Türkçe özet

Gmail için koyu, kuzey fantastiği havasında bir tema. Kurulum: `chrome://extensions` → **Geliştirici modu** → **Paketlenmemiş öğe yükle** → bu klasörü seç → Gmail'i yenile. Gmail'de **Tema → Koyu** ve **Okuma bölmesi → Gelen kutusunun sağında** ayarlarını öneririz. Eklenti simgesinden tema, sis ve ejderha açılıp kapatılabilir, kendi arka plan resmin seçilebilir. Resim sadece tarayıcında saklanır.
