# Instagram Auto Follow Console Script

A lightweight browser-console script for following visible users from Instagram web lists, such as a post's likes list, an account's followers list, or an account's following list.

It works in Chrome, Firefox, and most Chromium-based browsers. Safari has not been tested.

> ⚠️ This project is not affiliated with, endorsed by, or connected to Instagram or Meta. Use it carefully, understand the risks, and make your own judgement before running automation on any account.

## What It Does

- Finds visible `Follow` buttons inside Instagram web list dialogs.
- Clicks users one by one with randomized wait intervals.
- Scrolls the active list automatically when no visible `Follow` button is found.
- Stops when it reaches the bottom of the list or the configured run duration ends.
- Prints clear progress messages in the browser console.

## Browser Support

Tested target browsers:

- Google Chrome
- Mozilla Firefox and Firefox-based browsers
- Chromium-based browsers such as Brave, Edge, and Arc

Not tested:

- Safari

## Before You Use It

Please read this part. It matters.

- 🌍 **Use Instagram in English.** The script looks for buttons with the exact text `Follow`. If your Instagram language is not English, the script may not find the buttons.
- 🖥️ **Run it only on Instagram web.** Open Instagram in your browser, open a list, then paste the script into the browser console.
- 👀 **Keep the list open.** The script works on the visible list dialog you currently have open, such as post likes or account followers.
- ⏳ **Random waits are not a shield.** The script uses random intervals to avoid clicking with the exact same timing every time, but this does not guarantee protection from rate limits, temporary blocks, or account restrictions.
- 🚦 **Use your own judgement.** Do not run it aggressively. Do not use it on accounts you are not willing to risk.
- 📜 **Check platform rules first.** Automation may violate Instagram's current terms or policies.
- 🧩 **Instagram can change anytime.** If Instagram updates its interface, this script may stop working.
- 🙋 **You are responsible for your usage.** This project only provides the code; it does not control how you use it.

## Usage

1. Open [Instagram web](https://www.instagram.com/) in a supported browser.
2. Open any Instagram user list, for example:
   - Likes on a post
   - Followers of an account
   - Following list of an account
3. Make sure the list dialog is visible.
4. Open Developer Tools:
   - Chrome/Chromium: `Command + Option + I` on macOS or `Ctrl + Shift + I` on Windows/Linux
   - Firefox: `Command + Option + I` on macOS or `Ctrl + Shift + I` on Windows/Linux
5. Go to the `Console` tab.
6. Paste the contents of [`instagram-auto-follow.js`](./instagram-auto-follow.js).
7. Press `Enter`.

The script will start with a small console message, find visible `Follow` buttons, click them one by one, scroll when needed, and log its progress until it finishes.

You will see messages like:

```text
🌱 Instagram Auto Follow started.
✅ Followed #1
⏳ Waiting 25 seconds before the next one...
✨ Follow script complete. Total followed in this run: 12.
```

## Configuration

You can adjust these values near the top of the script:

```js
const FOLLOW_LIMIT = 1000;
const BREAK_DURATION = 5 * 60 * 1000;
const TOTAL_DURATION = 10 * 60 * 1000;
```

- `FOLLOW_LIMIT`: Maximum follow attempts per cycle.
- `BREAK_DURATION`: Break time between cycles, in milliseconds.
- `TOTAL_DURATION`: Run duration per cycle, in milliseconds.

The per-follow interval is randomized in the script:

```js
const FOLLOW_INTERVAL = Math.floor(Math.random() * 10 + 1) * 5000;
```

This produces waits between 5 and 50 seconds.

## GitHub Repository Description

Instagram auto-follow browser-console script for Chrome, Firefox, and Chromium-based browsers.

## Suggested Topics

`instagram`, `automation`, `browser-console`, `javascript`, `chrome`, `firefox`, `userscript`

## Disclaimer

This code is provided for educational and personal-use purposes. It is not an official Instagram or Meta tool. The author is not responsible for account limitations, rate limits, platform restrictions, lost access, or any other consequence of running automation.
