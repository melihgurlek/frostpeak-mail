# Chrome Web Store listing

Everything to paste into the developer dashboard. Upload `dist/frostpeak-mail-<version>.zip` from `python tools/package.py`.

## Store listing

**Name:** Frostpeak Mail (comes from the manifest)

**Summary** (from the manifest, max 132 characters):
> A dark Nordic-fantasy theme for Gmail: misty mountains, drifting fog, framed menus and a dragon that passes now and then.

**Description (English):**

> Turn Gmail into something out of a cold northern saga.
>
> Frostpeak Mail paints misty mountains and pine forests behind your inbox, lets fog drift slowly across them, and every so often a dragon glides over the peaks. Menus and buttons get framed, arrow-cut edges; text is set in clean condensed type; and when you send a mail, a banner tells you a courier has been dispatched.
>
> • Live painted landscape with drifting fog, or your own wallpaper
> • An occasional dragon (you can turn it off)
> • Readable: long text uses a wider face, mail bodies stay legible, newsletters are shown on a parchment sheet with their own colors
> • Dimming control for bright wallpapers
> • Switch the theme, fog or dragon on and off instantly from the toolbar
> • Respects your system's reduced-motion setting
> • English and Turkish
>
> Privacy: Frostpeak Mail collects nothing and sends nothing anywhere. It has no servers, analytics or ads. It only changes how Gmail looks in your browser.
>
> Tip: for the best result set Gmail's theme to Dark and the reading pane to "Right of inbox".
>
> Gmail is a trademark of Google LLC. Frostpeak Mail is not affiliated with or endorsed by Google.

**Description (Türkçe):**

> Gmail'i soğuk bir kuzey destanından çıkmış gibi gösterin.
>
> Frostpeak Mail, gelen kutunuzun arkasına sisli dağlar ve çam ormanları çizer, üzerlerinden sis yavaşça süzülür ve arada bir zirvelerin üstünden bir ejderha geçer. Menüler ve butonlar uçları ok gibi kesilmiş çerçevelere kavuşur, yazılar dar ve temiz bir fontla görünür, mail gönderdiğinizde de "Ulak yola çıktı" yazısı belirir.
>
> • Süzülen sisli canlı manzara ya da kendi duvar kâğıdınız
> • Arada bir geçen bir ejderha (kapatılabilir)
> • Okunaklı: uzun metinler daha geniş fontla, bültenler kendi renkleriyle parşömen üstünde
> • Parlak duvar kâğıtları için karartma ayarı
> • Tema, sis ve ejderha araç çubuğundan anında açılıp kapanır
> • Sistemin "hareketi azalt" ayarına uyar
> • İngilizce ve Türkçe
>
> Gizlilik: Frostpeak Mail hiçbir veri toplamaz ve hiçbir yere bir şey göndermez. Sunucusu, analitiği ve reklamı yoktur.
>
> Gmail, Google LLC'nin ticari markasıdır. Frostpeak Mail, Google ile bağlantılı değildir.

**Category:** Make Chrome Yours → Functionality & UI (or the closest "themes / appearance" category the dashboard offers)

**Language:** English (add Turkish as a second listing language)

## Graphics

| Asset | Size | Where it comes from |
| --- | --- | --- |
| Store icon | 128 × 128 | `icons/icon128.png` |
| Screenshots (1–5) | 1280 × 800 | Take them from Gmail yourself. Use a test account or hide personal mail. |
| Small promo tile | 440 × 280 | `dev/promo.html` → Download |
| Marquee (optional) | 1400 × 560 | `dev/promo.html` → Download |

Good screenshots: inbox with categories, an open plain-text mail, a newsletter on parchment, the popup menu, the background-image page.

## Privacy practices tab

**Single purpose:**
> Changes the visual appearance of Gmail (colors, fonts, background) to a dark fantasy theme.

**Permission justification: `storage`**
> Saves the user's theme switches (theme, fog, dragon, dimming) and the optional background image they choose.

**Permission justification: host access (content script on https://mail.google.com/\*)**
> The theme is a stylesheet and script that must run on Gmail pages to restyle them. It runs on no other site.

**Remote code:** No, I am not using remote code. (All scripts, styles and fonts ship inside the package.)

**Data usage:** tick nothing in "What user data do you plan to collect". Then certify all three statements:
- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

**Privacy policy URL:** the published `PRIVACY.md`. The repository must be public for this link to work, for example:
`https://github.com/melihgurlek/frostpeak-mail/blob/main/PRIVACY.md`
