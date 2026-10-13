# Chrome Web Store listing

Everything to paste into the developer dashboard. Upload `dist/frostpeak-mail-<version>.zip` from `python tools/package.py`.

## Store listing

**Name:** Frostpeak Mail (comes from the manifest)

**Summary** (from the manifest, max 132 characters):
> A dark Nordic-fantasy theme for Gmail: misty mountains, drifting fog, framed menus and a dragon that passes now and then.

**Description:**

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
> • Interface in English and Turkish
>
> Privacy: Frostpeak Mail collects nothing and sends nothing anywhere. It has no servers, analytics or ads. It only changes how Gmail looks in your browser.
>
> Tip: for the best result set Gmail's theme to Dark and the reading pane to "Right of inbox".
>
> Gmail is a trademark of Google LLC. Frostpeak Mail is not affiliated with or endorsed by Google.

**Category:** Make Chrome Yours → Functionality & UI (or the closest "themes / appearance" category the dashboard offers)

**Language:** English. The extension's own interface is also translated to Turkish (`_locales/tr`), so Turkish-speaking users get it automatically.

## Graphics

`python tools/screenshots.py` renders all of these with headless Chrome.

| Asset | Size | Where it comes from |
| --- | --- | --- |
| Store icon | 128 × 128 | `icons/icon128.png` |
| Screenshots (4) | 1280 × 800 | `dist/screenshots/`. Rendered from `dev/showcase.html`: the real skin over made-up mail, so no personal inbox is published. |
| Small promo tile | 440 × 280 | `dist/promo/small-tile-440x280.png` |
| Marquee (optional) | 1400 × 560 | `dist/promo/marquee-1400x560.png` |

The four views: inbox with category badges and the courier banner, an open plain-text mail, a newsletter on parchment, the compose window.

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
