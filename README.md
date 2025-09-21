# FusionERP AI Agent Site

A marketing site for FusionERP showcasing plan tiers and a built-in AI agent powered by OpenAI. The agent helps prospective customers compare plans and learn about integrations in real time.

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env` and set your OpenAI credentials:

   ```bash
   cp .env.example .env
   # edit .env to add your real key
   ```

3. **Run the app**

   ```bash
   npm start
   ```

   The site will be available at [http://localhost:3000](http://localhost:3000).

## Project structure

```
.
├── public
│   ├── app.js         # Front-end chat logic
│   ├── index.html     # Landing page markup
│   └── style.css      # Visual styles for the site
├── server.js          # Express server + OpenAI proxy
├── package.json       # Dependencies and scripts
├── package-lock.json  # Generated after `npm install`
└── .env.example       # Template for API configuration
```

## Notes

- The AI endpoint expects `OPENAI_API_KEY` to be defined in your environment.
- Responses use the `gpt-4o-mini` model for fast, cost-effective interactions.
- Update the marketing copy or styling by editing the HTML/CSS files in `public/`.
