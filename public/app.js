const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const userMessageInput = document.getElementById('userMessage');
const yearEl = document.getElementById('currentYear');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const chatHistory = [];

function appendMessage({ role, content }) {
  if (!chatWindow) {
    return;
  }

  const messageEl = document.createElement('div');
  messageEl.classList.add('message');
  messageEl.classList.add(role === 'user' ? 'user' : 'bot');

  const senderLabel = document.createElement('span');
  senderLabel.classList.add('sender');
  senderLabel.textContent = role === 'user' ? 'You' : 'FusionERP AI';

  const text = document.createElement('p');
  text.textContent = content;

  messageEl.appendChild(senderLabel);
  messageEl.appendChild(text);

  chatWindow.appendChild(messageEl);
  chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
}

async function sendMessage(message) {
  appendMessage({ role: 'user', content: message });

  const payloadHistory = [...chatHistory];
  chatHistory.push({ role: 'user', content: message });

  const typingIndicator = document.createElement('div');
  typingIndicator.classList.add('message', 'bot');
  typingIndicator.innerHTML = `
    <span class="sender">FusionERP AI</span>
    <p><span class="dot"></span><span class="dot"></span><span class="dot"></span></p>
  `;
  chatWindow.appendChild(typingIndicator);
  chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        history: payloadHistory
      })
    });

    typingIndicator.remove();

    if (!response.ok) {
      throw new Error('Failed to reach the AI assistant.');
    }

    const data = await response.json();

    if (!data.reply) {
      throw new Error('No response received.');
    }

    chatHistory.push({ role: 'assistant', content: data.reply });
    appendMessage({ role: 'assistant', content: data.reply });
  } catch (error) {
    typingIndicator.remove();
    appendMessage({
      role: 'assistant',
      content:
        error.message ||
        'Something went wrong while reaching the FusionERP AI. Please try again later.'
    });
  }
}

if (chatForm && userMessageInput) {
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = userMessageInput.value.trim();

    if (!message) {
      return;
    }

    sendMessage(message);
    userMessageInput.value = '';
    userMessageInput.focus();
  });
}
