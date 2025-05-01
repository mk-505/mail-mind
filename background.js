chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message);
  
  if (message.type === 'gptRequest') {
    (async () => {
      try {
        console.log('Making API request to Azure OpenAI...');
        const res = await fetch('https://mroo-ma49gstq-eastus2.cognitiveservices.azure.com/openai/deployments/o3-mini/chat/completions?api-version=2024-12-01-preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': 'your API key'
          },
          body: JSON.stringify({
            messages: message.messages,
            max_completion_tokens: 800
          })
        });

        console.log('API response status:', res.status);
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error('API error response:', errorData);
          throw new Error(errorData.error?.message || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('API success response:', data);
        sendResponse({ data });
      } catch (err) {
        console.error('Azure OpenAI fetch error:', err);
        sendResponse({ error: err.message });
      }
    })();
    return true; // Keep the message channel open for async response
  }
});
