function waitForGmailCompose() {
  const composeCheck = setInterval(() => {
    const toolbar = document.querySelector('[aria-label="More send options"]')?.parentElement;
    if (toolbar && !document.getElementById('gpt-compose-btn')) {
      const btn = document.createElement('button');
      btn.innerText = '✏️ GPT Write';
      btn.id = 'gpt-compose-btn';
      btn.style.marginLeft = '10px';

      btn.onclick = () => {
        const editableDiv = document.querySelector('[aria-label="Message Body"] div[contenteditable="true"]') ||
                            document.querySelector('div[contenteditable="true"][aria-label][role="textbox"]');

        if (editableDiv) {
          console.log('✅ Found editable email body');
          handleGPTCompose(editableDiv);
        } else {
          console.warn('⚠️ Could not find the editable email body');
          alert("Couldn't find the email body.");
        }
      };

      toolbar.appendChild(btn);
    }
  }, 2000);
}

async function handleGPTCompose(emailBodyDiv) {
  const userPrompt = prompt("What should this email say?");
  if (!userPrompt) return;

  const bodyText = getEmailThreadText();
  console.log('Starting GPT compose with prompt:', userPrompt);

  try {
    let response;
    try {
      console.log('Sending message to background script...');
      response = await chrome.runtime.sendMessage({
        type: 'gptRequest',
        messages: [
          { role: 'system', content: 'You are an assistant writing professional emails.' },
          { role: 'user', content: `Email context: ${bodyText}\n\nPrompt: ${userPrompt}` }
        ]
      });
      console.log('Received response from background script:', response);
    } catch (err) {
      console.error('Error in message passing:', err);
      if (err.message.includes('Extension context invalidated')) {
        console.error('Extension needs to be reloaded');
        alert('Please reload the extension and try again.');
        return;
      }
      throw err;
    }

    if (!response) {
      console.error('No response received from background script');
      alert('Failed to get response from AI. Please try again.');
      return;
    }

    if (response.error) {
      console.error('AI Error:', response.error);
      alert('Failed to reach AI: ' + response.error);
      return;
    }

    const data = response.data;
    console.log('Processing AI response data:', data);

    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Invalid AI response', data);
      alert('AI response was invalid. Please try again.');
      return;
    }

    const reply = data.choices[0].message.content;
    console.log('📝 AI Reply:', reply);

    emailBodyDiv.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, reply);

  } catch (err) {
    console.error('AI request failed:', err);
    if (err.message.includes('Extension context invalidated')) {
      alert('Please reload the extension and try again.');
    } else {
      alert('Error contacting AI: ' + err.message);
    }
  }
}

function getEmailThreadText() {
  let thread = document.querySelectorAll('div[role="listitem"]');
  let text = '';
  thread.forEach((el) => {
    const spans = el.querySelectorAll('span');
    spans.forEach((span) => text += span.innerText + '\n');
  });
  return text.slice(0, 3000);
}

waitForGmailCompose();
