# Gmail GPT Assistant

**Gmail GPT Assistant** is a Chrome extension that brings the power of GPT-based AI to your Gmail experience. It helps you draft, edit, and reply to emails with professional, context-aware suggestions—right inside Gmail.

---

## Features

- **GPT Write Button:** Adds a GPT Write button to Gmail's compose and reply toolbars.
- **Smart Suggestions:** When replying to an email thread, get 3 context-aware, professional suggested responses based on the latest message.
- **Custom Compose Modal:** Click the GPT Write button to open a modern, theme-aware modal where you can:
  - See suggested replies (when replying to a thread)
  - Enter your own prompt for the AI
  - Toggle between light and dark mode
- **Automatic Subject Line:** When drafting a new email, GPT will suggest a subject line and automatically fill it into the subject field.
- **Seamless Integration:** Works natively with Gmail's UI, both for new emails and replies.
- **Dark Mode Support:** The modal and suggestions adapt to Gmail's dark mode for a consistent look.
- **Loading Indicators:** Visual feedback while GPT is generating your email.

---

## Installation

1. **Clone or Download this Repository**
2. **Go to `chrome://extensions/` in Chrome**
3. **Enable Developer Mode** (top right)
4. **Click "Load unpacked"** and select the project folder
5. **You should see "Gmail GPT Assistant" in your extensions list**

---

## Usage

1. **Open Gmail in Chrome**
2. **Compose a New Email**  
   - Click the GPT Write button next to the Send button
   - In the popup, enter your prompt or use the AI's suggestion
   - For new emails, the subject line will be filled in automatically
3. **Reply to an Email Thread**
   - Click the GPT Write button in the reply toolbar
   - The popup will show 3 suggested replies based on the latest message in the thread
   - Click a suggestion or enter your own prompt
   - No subject line will be added to replies

---

## Project Structure

```
mail-mind/
├── background.js      # Handles communication with the GPT API
├── content.js         # Injects the GPT Write button and modal into Gmail
├── popup.html         # Extension popup (shows "Extension is ready to use!")
├── icon.png           # Extension icon
├── manifest.json      # Chrome extension manifest
└── README.md          # This file
```

---

## How It Works

- **content.js** injects a button into Gmail's compose/reply toolbars.
- When clicked, a modal appears for you to enter a prompt or select a suggested reply.
- For new emails, GPT generates a subject line and body; the subject is auto-filled.
- For replies, GPT generates only the body, with suggestions based on the latest thread message.
- **background.js** securely sends your prompt and context to the GPT API and returns the result.
- The extension supports both light and dark mode, updating styles dynamically.

---

## Permissions

- `activeTab`, `scripting`, `storage`: Required for injecting UI and storing settings.
- `https://mail.google.com/*`: To interact with Gmail.
- `https://api.openai.com/*`: (Or your Azure OpenAI endpoint) To access GPT.

---

## Customization

- **API Endpoint:**  
  The extension is currently set up to use an Azure OpenAI endpoint.  
  To use your own API key or endpoint, edit `background.js`:
  ```js
  const res = await fetch('YOUR_OPENAI_ENDPOINT', {
    headers: { 'api-key': 'YOUR_API_KEY' },
    ...
  });
  ```
- **Icon:**  
  Replace `icon.png` with your own if desired.

---

## Troubleshooting

- **Extension context invalidated:**  
  If you see this error, reload the extension from `chrome://extensions/` and refresh Gmail.
- **No GPT Write button:**  
  Make sure you're on the Gmail website and the extension is enabled.
- **Suggestions not loading:**  
  Check your API key and endpoint, and ensure you have internet access.

---

## Security & Privacy

- Your email content is only sent to the GPT API endpoint you configure.
- No data is stored or sent elsewhere.

---

## 👤 Author

Made with <3 by **Manroop Kalsi** & **Shaun Arulanandam**

