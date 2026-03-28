import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Keys from environment
const API_KEYS = {
  gemini: process.env.VITE_GEMINI_API_KEY,
  claude: process.env.VITE_CLAUDE_API_KEY,
  groq: process.env.VITE_GROQ_API_KEY,  // Groq (fast, free)
  grok: process.env.VITE_GROK_API_KEY,  // Grok/xAI (Elon's AI)
  openrouter: process.env.VITE_OPENROUTER_API_KEY,
};

console.log('='.repeat(60));
console.log('[Backend] Starting Resumate AI Server...');
console.log('[Backend] Environment:', process.env.NODE_ENV || 'development');
console.log('[Backend] API Keys configured:');
Object.entries(API_KEYS).forEach(([key, value]) => {
  if (value) {
    console.log(`  ✓ ${key.toUpperCase()}: ${value.substring(0, 20)}... (length: ${value.length})`);
  } else {
    console.log(`  ✗ ${key.toUpperCase()}: NOT CONFIGURED`);
  }
});
console.log('[Backend] Full env check:');
console.log('  VITE_GEMINI_API_KEY exists:', !!process.env.VITE_GEMINI_API_KEY);
console.log('  VITE_CLAUDE_API_KEY exists:', !!process.env.VITE_CLAUDE_API_KEY);
console.log('  VITE_GROK_API_KEY exists:', !!process.env.VITE_GROK_API_KEY);
console.log('  VITE_OPENROUTER_API_KEY exists:', !!process.env.VITE_OPENROUTER_API_KEY);
console.log('='.repeat(60));

// Clean JSON helper
const cleanJSON = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

// ============================================================================
// GEMINI API
// ============================================================================
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!API_KEYS.gemini) {
      return res.status(400).json({ error: 'Gemini API key not configured' });
    }

    console.log('[Gemini] Processing request...');
    console.log('[Gemini] Key length:', API_KEYS.gemini.length);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEYS.gemini}`,
      {
        contents: [{
          parts: [{
            text: prompt + '\n\nReturn ONLY valid JSON. No markdown, no explanations.'
          }]
        }],
        generationConfig: {
          responseMimeType: 'application/json',
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    console.log('[Gemini] Response status:', response.status);

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      return res.status(500).json({ error: 'Gemini returned empty response' });
    }

    const cleanedContent = cleanJSON(text);
    console.log('[Gemini] Response preview:', cleanedContent.substring(0, 200));
    
    const data = JSON.parse(cleanedContent);

    console.log('[Gemini] Success!');
    res.json({ success: true, data });

  } catch (error) {
    console.error('[Gemini] Error:', error.response?.status);
    console.error('[Gemini] Data:', JSON.stringify(error.response?.data, null, 2));
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    });
  }
});

// ============================================================================
// CLAUDE API
// ============================================================================
app.post('/api/claude', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!API_KEYS.claude) {
      return res.status(400).json({ error: 'Claude API key not configured' });
    }

    console.log('[Claude] Processing request...');

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: prompt + '\n\nReturn ONLY valid JSON. No markdown, no explanations.'
        }]
      },
      {
        headers: {
          'x-api-key': API_KEYS.claude,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 30000
      }
    );

    const text = response.data?.content?.[0]?.text;
    
    if (!text) {
      return res.status(500).json({ error: 'Claude returned empty response' });
    }

    const cleanedContent = cleanJSON(text);
    const data = JSON.parse(cleanedContent);

    console.log('[Claude] Success!');
    res.json({ success: true, data });

  } catch (error) {
    console.error('[Claude] Error:', error.response?.status, error.response?.data);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    });
  }
});

// ============================================================================
// GROQ API (Fast, Free)
// ============================================================================
app.post('/api/groq', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!API_KEYS.groq) {
      return res.status(400).json({ error: 'Groq API key not configured' });
    }

    console.log('[Groq] Processing request...');

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt + '\n\nReturn ONLY valid JSON.' }],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.groq}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;
    
    if (!text) {
      throw new Error('Groq returned empty response');
    }

    const cleanedContent = cleanJSON(text);
    const data = JSON.parse(cleanedContent);

    console.log('[Groq] Success!');
    res.json({ success: true, data, provider: 'groq' });

  } catch (error) {
    console.error('[Groq] Error:', error.response?.status, error.response?.data);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    });
  }
});

// ============================================================================
// GROK API (xAI - Elon Musk's AI)
// ============================================================================
app.post('/api/grok', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!API_KEYS.grok) {
      return res.status(400).json({ error: 'Grok API key not configured' });
    }

    console.log('[Grok] Processing request...');

    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-2-1212',
        messages: [{ role: 'user', content: prompt + '\n\nReturn ONLY valid JSON.' }],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.grok}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;
    
    if (!text) {
      throw new Error('Grok returned empty response');
    }

    const cleanedContent = cleanJSON(text);
    const data = JSON.parse(cleanedContent);

    console.log('[Grok] Success!');
    res.json({ success: true, data, provider: 'grok' });

  } catch (error) {
    console.error('[Grok] Error:', error.response?.status, error.response?.data);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    });
  }
});

// ============================================================================
// OPENROUTER API
// ============================================================================
app.post('/api/openrouter', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!API_KEYS.openrouter) {
      return res.status(400).json({ error: 'OpenRouter API key not configured' });
    }

    console.log('[OpenRouter] Processing request...');

    const fallbackModels = [
      'google/gemini-2.0-flash-lite-preview-02-05:free',
      'google/gemma-2-9b-it:free',
      'mistralai/mistral-7b-instruct:free',
      'meta-llama/llama-3-8b-instruct:free',
    ];

    let lastError;
    
    for (const model of fallbackModels) {
      try {
        console.log(`[OpenRouter] Trying model: ${model}`);
        
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: model,
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
          },
          {
            headers: {
              'Authorization': `Bearer ${API_KEYS.openrouter}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:3001',
              'X-Title': 'Resumate Backend',
            },
            timeout: 30000
          }
        );

        if (response.data.error) {
          throw new Error(response.data.error.message);
        }

        const text = response.data.choices[0].message.content;
        if (!text) throw new Error('Empty response');

        const cleanedContent = cleanJSON(text);
        const data = JSON.parse(cleanedContent);

        console.log(`[OpenRouter] Success with model: ${model}`);
        return res.json({ success: true, data, model });

      } catch (error) {
        lastError = error;
        console.log(`[OpenRouter] Model ${model} failed:`, error.message);
        if (error.response?.status === 401) {
          throw error; // Stop on auth error
        }
        continue;
      }
    }

    throw lastError;

  } catch (error) {
    console.error('[OpenRouter] Error:', error.response?.status, error.response?.data);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    });
  }
});

// ============================================================================
// SMART ROUTER - Tries all providers automatically with fallback
// ============================================================================
app.post('/api/analyze', async (req, res) => {
  try {
    const { prompt, type = 'resume' } = req.body;

    console.log('[Router] Received analyze request');
    console.log('[Router] Prompt length:', prompt?.length);
    console.log('[Router] Type:', type);

    // Build provider list in priority order
    // Groq is first (fast + free), then Grok (if configured), then others
    const providers = [];
    
    if (API_KEYS.groq) {
      providers.push('groq');
      console.log('[Router] ✓ Groq available (FAST + FREE)');
    }
    if (API_KEYS.grok) {
      providers.push('grok');
      console.log('[Router] ✓ Grok available (xAI)');
    }
    if (API_KEYS.gemini) {
      providers.push('gemini');
      console.log('[Router] ✓ Gemini available');
    }
    if (API_KEYS.claude) {
      providers.push('claude');
      console.log('[Router] ✓ Claude available');
    }
    if (API_KEYS.openrouter) {
      providers.push('openrouter');
      console.log('[Router] ✓ OpenRouter available (fallback)');
    }

    console.log('[Router] Provider order:', providers.join(' → '));

    if (providers.length === 0) {
      return res.status(500).json({ 
        error: 'No API keys configured',
        hint: 'Add at least one API key to .env file (GROQ recommended)'
      });
    }

    let lastError = null;
    let lastProvider = null;

    for (const provider of providers) {
      try {
        console.log(`\n[Router] >>>>>>> Trying ${provider.toUpperCase()}...`);
        
        const response = await axios.post(`http://localhost:${PORT}/api/${provider}`, {
          prompt
        }, {
          timeout: 30000
        });

        if (response.data.success) {
          console.log(`[Router] >>>>>>> ${provider.toUpperCase()} SUCCEEDED! <<<<<<<`);
          return res.json({
            success: true,
            data: response.data.data,
            provider: response.data.provider || provider,
            message: `Successfully used ${provider}`
          });
        }
      } catch (error) {
        lastError = error;
        lastProvider = provider;
        const errorMsg = error.response?.data?.error || error.message;
        const errorStatus = error.response?.status;
        console.log(`[Router] >>>>>>> ${provider.toUpperCase()} FAILED: ${errorStatus} - ${errorMsg} <<<<<<<\n`);
        
        // Continue to next provider (don't stop on errors)
        continue;
      }
    }

    // All providers failed
    console.error('\n[Router] >>>>>>> ALL PROVIDERS FAILED <<<<<<<\n');
    res.status(500).json({
      error: `All ${providers.length} AI providers failed`,
      providersTried: providers,
      lastProvider: lastProvider,
      lastError: lastError?.response?.data?.error || lastError?.message,
      hint: 'Check backend console for detailed error logs. Try adding a different API key.'
    });

  } catch (error) {
    console.error('[Router] Unexpected error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    providers: Object.entries(API_KEYS).map(([key, value]) => ({
      name: key,
      available: !!value
    })),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Express] Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Resumate Backend running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST /api/gemini`);
  console.log(`   POST /api/claude`);
  console.log(`   POST /api/grok`);
  console.log(`   POST /api/openrouter`);
  console.log(`   POST /api/analyze (auto-router)`);
  console.log(`   GET  /api/health`);
  console.log(`\n✅ Backend ready to accept requests!\n`);
});
