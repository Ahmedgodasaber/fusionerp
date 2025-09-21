import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey
  ? new OpenAI({ apiKey: openaiApiKey })
  : null;

if (!openaiApiKey) {
  console.warn('OPENAI_API_KEY is not set. The AI assistant will be disabled.');
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'AI assistant is not configured.' });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A message is required.' });
    }

    const sanitizedHistory = Array.isArray(history)
      ? history
          .filter(
            (entry) =>
              entry &&
              typeof entry === 'object' &&
              (entry.role === 'user' || entry.role === 'assistant') &&
              typeof entry.content === 'string'
          )
          .map((entry) => ({ role: entry.role, content: entry.content }))
      : [];

    const systemPrompt = `You are FusionERP's AI solutions expert. Help prospective customers understand how FusionERP's plans deliver value. Use the provided plan details when relevant:

Essentials ($19 USD per seat monthly, up to 2 seats) - Real-time tracking & notifications, real-time analytics, drag-and-drop templates, project management, 24/7 email and chat support.

Business ($12 USD per seat monthly) - Everything in Essentials plus HRMS and Zapier integrations, content reporting, unlimited team workspaces, approval workflows, Salesforce integration (available on request).

Enterprise (custom pricing, response within 24 hours) - Everything in Business plus unlimited file uploads, advanced real-time tracking, user performance insights, SSO and custom user roles, bulk send and smart forms.

Always be concise, friendly, and proactive in offering next steps such as connecting with sales or booking a demo.`;

    const conversation = [
      { role: 'system', content: systemPrompt },
      ...sanitizedHistory,
      { role: 'user', content: message }
    ];

    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: conversation
    });

    const reply = response.output_text?.trim();

    if (!reply) {
      return res.status(502).json({ error: 'No reply generated.' });
    }

    res.json({ reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate a response.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`FusionERP site is running on http://localhost:${port}`);
});
