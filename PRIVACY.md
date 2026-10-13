# Frostpeak Mail · Privacy Policy

*Last updated: 13 October 2026*

Frostpeak Mail is a visual theme for Gmail. It changes how Gmail looks in your browser and does nothing else.

## What it collects

Nothing. Frostpeak Mail has no servers, no analytics, no tracking and no advertising. It never sends any data anywhere.

## What it accesses

- **Gmail pages (`mail.google.com`).** The extension adds its stylesheet and script to Gmail pages so it can change their colors, fonts and background. To keep the theme readable, the script looks at the colors of elements on the page, including message bodies, and adjusts how they are displayed. It does not read, store, copy or transmit the content of your mail, contacts or account.
- **Its own files.** Fonts and icons are loaded from inside the extension package.

## What it stores

- **Your settings** (theme on/off, moving fog, dragon, dimming) in `chrome.storage.sync`. If you use Chrome Sync, Chrome syncs these few switches between your own browsers through your Google account, as it does for any extension.
- **Your background image**, if you choose one, in `chrome.storage.local`. It stays on your device and is never uploaded.

Uninstalling the extension deletes all of this.

## Permissions

| Permission | Why |
| --- | --- |
| `storage` | Remember your settings and your optional background image |
| Content script on `https://mail.google.com/*` | Apply the theme to Gmail; it runs on no other site |

## Contact

Questions: open an issue at https://github.com/melihgurlek/frostpeak-mail/issues

---

## Türkçe

Frostpeak Mail, Gmail için bir görsel temadır. **Hiçbir veri toplamaz, hiçbir yere veri göndermez.** Sunucusu, analitiği ve reklamı yoktur. Gmail sayfalarında sadece görünümü değiştirmek için çalışır. Okunabilirliği korumak için sayfadaki elemanların renklerine bakar, ama mailinin içeriğini okumaz, saklamaz ve iletmez. Ayarların `chrome.storage.sync` içinde, seçtiğin arka plan resmi ise sadece kendi cihazında `chrome.storage.local` içinde saklanır. Eklentiyi kaldırınca hepsi silinir.
