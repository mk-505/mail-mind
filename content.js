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

async function showCustomPrompt() {
  let isDarkMode = false;

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  const modalContent = document.createElement('div');
  const updateTheme = () => {
    modalContent.style.cssText = `
      background: ${isDarkMode ? '#202124' : 'white'};
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 20px ${isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.15)'};
      width: 500px;
      max-width: 90%;
      position: relative;
      transition: all 0.3s ease;
    `;
    title.style.color = isDarkMode ? '#ffffff' : '#202124';
    input.style.background = isDarkMode ? '#303134' : 'white';
    input.style.color = isDarkMode ? '#ffffff' : '#202124';
    input.style.border = `1px solid ${isDarkMode ? '#5f6368' : '#dadce0'}`;
    themeToggle.style.background = isDarkMode ? '#303134' : 'white';
    themeToggle.style.border = `1px solid ${isDarkMode ? '#5f6368' : '#dadce0'}`;
    themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
    cancelButton.style.background = isDarkMode ? '#303134' : 'white';
    cancelButton.style.color = isDarkMode ? '#ffffff' : '#5f6368';
    cancelButton.style.border = `1px solid ${isDarkMode ? '#5f6368' : '#dadce0'}`;

    // Update suggestions container and buttons for dark mode
    const suggestionsContainer = modalContent.querySelector('.gpt-suggestions-container');
    if (suggestionsContainer) {
      suggestionsContainer.style.background = isDarkMode ? '#23272b' : '#f8f9fa';
      suggestionsContainer.style.color = isDarkMode ? '#fff' : '#202124';
      suggestionsContainer.style.border = `1px solid ${isDarkMode ? '#444950' : '#dadce0'}`;
    }
    const suggestionButtons = modalContent.querySelectorAll('.gpt-suggestion-btn');
    suggestionButtons.forEach(button => {
      button.style.background = isDarkMode ? '#202124' : 'white';
      button.style.color = isDarkMode ? '#fff' : '#202124';
      button.style.border = `1px solid ${isDarkMode ? '#5f6368' : '#dadce0'}`;
    });
    // Also update the suggestions title if present
    const suggestionsTitle = modalContent.querySelector('.gpt-suggestions-title');
    if (suggestionsTitle) {
      suggestionsTitle.style.color = isDarkMode ? '#fff' : '#202124';
    }
  };

  const themeToggle = document.createElement('button');
  themeToggle.innerHTML = '🌙';
  themeToggle.style.cssText = `
    position: absolute;
    top: 12px;
    left: 12px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #dadce0;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    padding: 0;
    transition: all 0.3s ease;
  `;
  themeToggle.onclick = () => {
    isDarkMode = !isDarkMode;
    updateTheme();
  };
  themeToggle.onmouseover = () => {
    themeToggle.style.boxShadow = isDarkMode ?
      '0 0 8px rgba(255, 255, 255, 0.2)' :
      '0 0 8px rgba(0, 0, 0, 0.1)';
  };
  themeToggle.onmouseout = () => {
    themeToggle.style.boxShadow = 'none';
  };

  const title = document.createElement('h2');
  title.textContent = 'What should this email say?';
  title.style.cssText = `
    margin: 0 0 16px 0;
    color: #202124;
    font-size: 20px;
    font-weight: 500;
    padding-left: 28px;
    transition: color 0.3s ease;
  `;

  const input = document.createElement('textarea');
  input.style.cssText = `
    width: calc(100% - 24px);
    height: 100px;
    padding: 12px;
    border: 1px solid #dadce0;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 14px;
    resize: none;
    font-family: inherit;
    box-sizing: border-box;
    outline: none;
    transition: all 0.3s ease;
  `;
  input.placeholder = 'Describe what you want to write...';

  // Check if we're in a reply thread
  const isReplyThread = document.querySelector('div[role="listitem"]') !== null;
  let suggestionsContainer = null;

  if (isReplyThread) {
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'gpt-suggestions-container';
    suggestionsContainer.style.cssText = `
      margin-bottom: 16px;
      padding: 12px;
      background: ${isDarkMode ? '#23272b' : '#f8f9fa'};
      color: ${isDarkMode ? '#fff' : '#202124'};
      border-radius: 8px;
      border: 1px solid ${isDarkMode ? '#444950' : '#dadce0'};
      transition: background 0.3s, color 0.3s;
    `;

    const suggestionsTitle = document.createElement('h3');
    suggestionsTitle.className = 'gpt-suggestions-title';
    suggestionsTitle.textContent = 'Suggested Responses';
    suggestionsTitle.style.cssText = `
      margin: 0 0 12px 0;
      font-size: 16px;
      color: ${isDarkMode ? '#fff' : '#202124'};
    `;
    suggestionsContainer.appendChild(suggestionsTitle);

    try {
      const lastEmail = getEmailThreadText();
      const response = await chrome.runtime.sendMessage({
        type: 'gptRequest',
        messages: [
          { role: 'system', content: 'You are an assistant helping write email replies. Generate 3 different professional response options based on the most recent email in the thread. Each response should be a complete, well-formed sentence that could be used as a reply.' },
          { role: 'user', content: `Most recent email: ${lastEmail}\n\nGenerate 3 different professional response options. Each response should be a complete sentence that could be used as a reply. Format each response with a number and newline, like:\n1. First response\n2. Second response\n3. Third response` }
        ]
      });

      if (response && response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
        const suggestions = response.data.choices[0].message.content;
        const responseOptions = suggestions.split('\n').filter(line => line.trim().match(/^\d+\./));

        responseOptions.forEach(option => {
          const button = document.createElement('button');
          button.className = 'gpt-suggestion-btn';
          button.textContent = option.replace(/^\d+\.\s*/, '');
          button.style.cssText = `
            display: block;
            width: 100%;
            padding: 8px 12px;
            margin-bottom: 8px;
            border: 1px solid ${isDarkMode ? '#5f6368' : '#dadce0'};
            border-radius: 4px;
            background: ${isDarkMode ? '#202124' : 'white'};
            color: ${isDarkMode ? '#fff' : '#202124'};
            cursor: pointer;
            text-align: left;
            font-size: 14px;
            transition: all 0.2s ease;
          `;

          button.onmouseover = () => {
            button.style.background = isDarkMode ? '#444950' : '#f8f9fa';
            button.style.borderColor = '#1a73e8';
          };

          button.onmouseout = () => {
            button.style.background = isDarkMode ? '#202124' : 'white';
            button.style.borderColor = isDarkMode ? '#5f6368' : '#dadce0';
          };

          button.onclick = () => {
            input.value = button.textContent;
            input.focus();
          };

          suggestionsContainer.appendChild(button);
        });
      }
    } catch (err) {
      console.error('Error generating suggestions:', err);
    }
  }

  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  `;

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.style.cssText = `
    padding: 8px 16px;
    border: 1px solid #dadce0;
    border-radius: 4px;
    background: white;
    color: #5f6368;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
  `;

  const gptWriteButton = document.createElement('button');
  gptWriteButton.textContent = 'GPT Write';
  gptWriteButton.style.cssText = `
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: #1a73e8;
    color: white;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
  `;

  // Add hover effects
  cancelButton.onmouseover = () => {
    cancelButton.style.boxShadow = isDarkMode ?
      '0 0 8px rgba(255, 255, 255, 0.2)' :
      '0 0 8px rgba(0, 0, 0, 0.1)';
    cancelButton.style.background = isDarkMode ? '#404144' : '#f8f9fa';
  };
  cancelButton.onmouseout = () => {
    cancelButton.style.boxShadow = 'none';
    cancelButton.style.background = isDarkMode ? '#303134' : 'white';
  };

  gptWriteButton.onmouseover = () => {
    gptWriteButton.style.boxShadow = '0 0 12px rgba(26, 115, 232, 0.4)';
    gptWriteButton.style.background = '#1557b0';
  };
  gptWriteButton.onmouseout = () => {
    gptWriteButton.style.boxShadow = 'none';
    gptWriteButton.style.background = '#1a73e8';
  };

  modalContent.appendChild(themeToggle);
  modalContent.appendChild(title);
  if (suggestionsContainer) {
    modalContent.appendChild(suggestionsContainer);
  }
  modalContent.appendChild(input);
  modalContent.appendChild(buttonContainer);
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(gptWriteButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  updateTheme();
  input.focus();

  return new Promise((resolve) => {
    cancelButton.onclick = () => {
      modal.remove();
      resolve(null);
    };

    gptWriteButton.onclick = () => {
      const userPrompt = input.value.trim();
      modal.remove();
      resolve(userPrompt);
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        gptWriteButton.click();
      }
    };
  });
}

async function handleGPTCompose(emailBodyDiv) {
  const userPrompt = await showCustomPrompt();
  if (!userPrompt) return;

  // Check if we're in a reply thread
  const isReplyThread = document.querySelector('div[role="listitem"]') !== null;
  const bodyText = isReplyThread ? getEmailThreadText() : '';

  console.log('Starting GPT compose with prompt:', userPrompt);

  try {
    let response;
    try {
      console.log('Sending message to background script...');
      response = await chrome.runtime.sendMessage({
        type: 'gptRequest',
        messages: [
          {
            role: 'system', content: isReplyThread ?
              'You are an assistant writing professional email replies. Write only the reply text without any subject line.' :
              'You are an assistant writing professional emails. Include a subject line at the start of your response in the format "Subject: [subject line]".'
          },
          {
            role: 'user', content: isReplyThread ?
              `Email context: ${bodyText}\n\nPrompt: ${userPrompt}` :
              `Write a new email with the following prompt: ${userPrompt}`
          }
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

    let reply = data.choices[0].message.content;
    console.log('📝 AI Reply:', reply);

    if (isReplyThread) {
      // Remove any subject line from replies
      reply = reply.replace(/^Subject:.*?\n/i, '').trim();
    } else {
      // Handle subject line for new emails
      const subjectMatch = reply.match(/^Subject:\s*(.*?)(?:\n|$)/i);
      if (subjectMatch) {
        // Set the subject line
        const subjectInput = document.querySelector('input[name="subjectbox"]');
        if (subjectInput) {
          subjectInput.value = subjectMatch[1].trim();
        }
        // Remove the subject line from the body
        reply = reply.replace(/^Subject:.*?\n/i, '').trim();
      }
    }

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
  if (thread.length === 0) return '';

  // Get the last email in the thread (most recent)
  const lastEmail = thread[thread.length - 1];
  let text = '';
  const spans = lastEmail.querySelectorAll('span');
  spans.forEach((span) => text += span.innerText + '\n');
  return text.slice(0, 3000);
}

waitForGmailCompose();
