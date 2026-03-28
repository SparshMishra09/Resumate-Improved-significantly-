// Test script to verify OpenRouter API key
// Run this in browser console (F12) after uploading a resume

const OPENROUTER_API_KEY = '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';

async function testAPI() {
  console.log("Testing OpenRouter API...");
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Resumate Test',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite-preview-06-17:free',
        messages: [
          { role: 'user', content: 'Say hello' }
        ]
      })
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", data);
    
    if (data.error) {
      console.error("API Error:", data.error);
    } else {
      console.log("Success! API response:", data.choices[0].message.content);
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

testAPI();
