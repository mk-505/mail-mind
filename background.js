chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'gptRequest') {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${message.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: message.messages
        })
      });
      const data = await res.json();
      sendResponse({ success: true, data });
    } catch (err) {
      console.error('GPT fetch error:', err);
      sendResponse({ success: false, error: err.toString() });
    }
  }
  return true;
});
