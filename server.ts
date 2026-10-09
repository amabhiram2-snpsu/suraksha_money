import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({ apiKey });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI with key:', err);
    }
  }

  // API endpoint: /api/chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, language, context } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (ai) {
        const systemPrompt = `You are Suraksha Money AI, a dedicated Indian personal finance and digital payment safety assistant.
You provide clear, accurate guidance to users (especially seniors and families) in India.
The user's preferred language is: ${language || 'en'}.
Respond in the language requested (Hindi, Tamil, Telugu, English, etc.) warmly and concisely.

User Financial Ledger Context:
- User Name: ${context?.userName || 'Kamala Ji'}
- Total Monthly Inflow: ₹${context?.totalIncome || 34500}
- Total Monthly Expenses: ₹${context?.totalExpenses || 22000}
- Available Surplus: ₹${context?.availableBalance || 12500}
- Incomes: ${JSON.stringify(context?.incomes || [])}
- Expenses: ${JSON.stringify(context?.expenses || [])}
- Goals: ${JSON.stringify(context?.goals || [])}
- Debts: ${JSON.stringify(context?.debts || [])}

When responding, give practical advice and remind the user of safe digital banking rules (never share OTP/UPI PIN).`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [message],
          config: {
            systemInstruction: systemPrompt,
          },
        });

        const reply = response.text || 'I have analyzed your request.';
        return res.json({ reply });
      } else {
        return res.status(200).json({
          reply: `Suraksha AI Assistant: Based on your records, your monthly inflow is ₹${context?.totalIncome || 34500} and total expenses are ₹${context?.totalExpenses || 22000}, with ₹${context?.availableBalance || 12500} available surplus.`,
        });
      }
    } catch (error: any) {
      console.error('Error generating AI response:', error);
      return res.status(500).json({ error: error.message || 'AI service error' });
    }
  });

  // Vite integration: middleware in dev or static in prod
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
