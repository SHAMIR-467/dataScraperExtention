# Chrome Web Store — Resubmission Guide (v1.9.2)

Your extension was likely rejected for one or more of the issues below. Version **1.9.2** fixes the most common causes.

---

## Why rejections happen (most likely for this extension)

| Issue | What Google flags | What we fixed |
|-------|-------------------|---------------|
| **Broad permissions** | `host_permissions: *://*/*` requests access to every website at install time | Removed. Website access is now **optional** — user grants it from the popup |
| **Branding** | Using “Google Maps” in the name or implying Google affiliation | Renamed to **Xyber Business Email Extractor** + disclaimer in UI and listing |
| **Privacy policy** | Extensions that collect/process user data must publish a privacy policy URL | Added `privacy.html` — you must host it publicly |
| **Web accessible resources** | `injected.js` exposed to `<all_urls>` | Limited to Google Maps URLs only |
| **Misleading labels** | “Open Source” without proof | Changed to **Powered by Xyber** |
| **Permission justification** | Reviewers cannot see why broad access is needed | Popup explains optional website access for public email discovery |

Check your **rejection email** in the Chrome Web Store dashboard for the exact policy cited.

---

## Before you resubmit (required checklist)

### 1. Host privacy policy publicly

Upload `privacy.html` to your website, for example:

`https://txyber.com/privacy`

In the Chrome Web Store dashboard → **Privacy** → paste that URL.

The extension `chrome-extension://` URL is **not** accepted.

### 2. Upload new ZIP (v1.9.2)

Include:

- `manifest.json`, `popup.html`, `dashboard.html`, `privacy.html`, `help.html`
- `bg.js`, `contentScript.js`, `contentScript2.js`, `injected.js`
- `icons/`, `css/`, `js/`, required `lib/` files

Exclude:

- `.git/`
- `CHROME_WEB_STORE_LISTING.md`
- `maps-matches.json`
- `White_Logo_for_Dark_theme.png` (already in `icons/white-logo.png`)

### 3. Update store listing fields

**Extension name**

`Xyber Business Email Extractor`

**Short description** (max 132 characters)

`Collect public business emails while browsing map listings. Export CSV/TXT locally. Optional website access. By Xyber.`

**Detailed description** — include this attribution block:

```
Google Maps is a trademark of Google LLC. Use of this trademark is subject to Google Permissions.

This extension is not affiliated with, endorsed by, or sponsored by Google.
```

**Single purpose** (dashboard field)

`Extract public business contact information from map search results and export email lists for lead generation.`

**Category**

`Productivity`

**Privacy policy URL**

`https://txyber.com/privacy` (use your real hosted URL)

### 4. Permission justifications (copy into review form if asked)

**storage**

`Stores collected business leads locally in the browser so the dashboard and export features can display and download them.`

**optional host permission (http/https)**

`Only requested when the user clicks "Enable website access" to discover publicly published emails on business websites linked from map listings. Not required for basic listing collection.`

**content scripts on Google Maps domains**

`Reads publicly visible business listing data on map search pages the user visits to build a local lead list.`

### 5. Screenshots (required)

Provide at least 1 screenshot showing:

1. Popup with Xyber branding, permission button, and legal disclaimer
2. Dashboard with export buttons
3. Map page with extract controls (optional but helpful)

---

## Store listing — full detailed description

**Xyber Business Email Extractor** helps sales and marketing users collect **public business contact information** while browsing map search results.

**Features**

- Open map searches from the extension popup
- Collect visible business listings on map pages
- Optional email discovery from public business websites
- Local dashboard with row count and unique email stats
- Export Email CSV, Email TXT, Full CSV, and Full XLSX

**How it works**

1. Install and pin the extension
2. Enter a search query and open map results
3. Use extract controls on the map page
4. Optionally enable website access for email discovery
5. Open the dashboard and export your list

**Data & privacy**

- Lead data is stored locally in your browser
- Data is not uploaded to Xyber servers
- You control when data is exported

**Disclaimer**

Google Maps is a trademark of Google LLC. Use of this trademark is subject to Google Permissions.

This extension is not affiliated with, endorsed by, or sponsored by Google. Users are responsible for complying with applicable laws and third-party terms when collecting contact data.

**Support:** https://txyber.com

---

## If rejected again

1. Read the **exact rejection email** — it names the policy (Branding, Privacy, Permissions, etc.)
2. Open **How to Appeal** only if you fixed that specific issue
3. In your appeal, list changes made in v1.9.2:
   - Removed install-time `*://*/*` permission
   - Added optional permission flow
   - Added privacy policy and Google trademark disclaimer
   - Narrowed web accessible resources

---

## Test locally before resubmitting

1. Go to `chrome://extensions`
2. Load unpacked → select extension folder
3. Confirm popup shows Xyber logo and **Enable website access** button
4. Open Google Maps, test extract flow
5. Open dashboard and export a file
6. Confirm no install-time warning for “Read and change all your data on all websites”

If Chrome still shows broad access at install, the old ZIP was uploaded — rebuild from v1.9.2 `manifest.json`.
