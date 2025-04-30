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

  try {
    const response = await chrome.runtime.sendMessage({
      type: 'gptRequest',
      apiKey: 'YOUR_OPENAI_API_KEY',
      messages: [
        { role: 'system', content: 'You are an assistant writing professional emails.' },
        { role: 'user', content: `Email context: ${bodyText}\n\nPrompt: ${userPrompt}` }
      ]
    });

    if (!response.success) {
      console.error('GPT Error:', response.error);
      alert('Failed to reach GPT.');
      return;
    }

    const data = response.data;

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Invalid GPT response', data);
      alert('GPT response was invalid.');
      return;
    }

    const reply = data.choices[0].message.content;
    console.log('📝 GPT Reply:', reply);

    emailBodyDiv.focus();
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, reply);

  } catch (err) {
    console.error('GPT request failed:', err);
    alert('Error contacting GPT.');
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
