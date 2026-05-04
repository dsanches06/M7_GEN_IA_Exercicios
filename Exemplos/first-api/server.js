import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// Check if API key is available
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Gemini API helper function
async function callGemini(userPrompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }]
    });
    
    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to call Gemini API');
  }
}




// Middleware
app.use(cors());
app.use(express.json());

// AI Helper Functions with Gemini Integration
async function createTaskFromText(text) {
  const prompt = `Transforma o seguinte texto em uma tarefa estruturada no formato JSON. Responde apenas com o JSON, sem texto adicional.

Texto: "${text}"

Retorna o JSON neste formato:
{
  "title": "título conciso e profissional",
  "description": "descrição clara e objetiva",
  "priority": "high/medium/low",
  "tags": ["tag1", "tag2"]
}`;

  try {
    const response = await callGemini(prompt);
    const cleanedResponse = response.replace(/```json\n?|```/g, '').trim();
    console.log('Gemini Response:', cleanedResponse);
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Error in createTaskFromText:', error);
    // Fallback to simple processing
    return {
      title: "Tarefa criada via IA",
      description: text,
      priority: "medium",
      tags: ["ia"]
    };
  }
}

// API Routes

// POST /api/tasks/create
app.post('/api/tasks/create', async (req, res) => {
    try {
        const { text } = req.body;

        // Input validation
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required and must be a non-empty string'
            });
        }


        const task = await createTaskFromText(text.trim());

        res.status(201).json({
            success: true,
            data: task
        });

    } catch (error) {
        console.error('Error in /api/tasks/create:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});


// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'AI Task System API',
        endpoints: [
            'POST /api/tasks/create - Create task from text',
            'GET /health - Health check'
        ]
    });
});

// Health endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok',
        uptime: process.uptime()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AI Task System API running on port ${PORT}`);
    console.log(`📖 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
