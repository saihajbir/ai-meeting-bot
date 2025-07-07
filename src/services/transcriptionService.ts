import OpenAI from 'openai';

// Get the API key from environment variable
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

// Debug: Log API key status (but not the key itself)
console.log('OpenAI Configuration:', {
  apiKeyExists: !!API_KEY,
  apiKeyValid: API_KEY?.startsWith('sk-'),
  apiKeyLength: API_KEY?.length
});

if (!API_KEY) {
  console.error('⚠️ OpenAI API key is missing! Check your .env file');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: API_KEY || '',
  dangerouslyAllowBrowser: true
});

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Create FormData
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    console.log('Sending audio to OpenAI:', {
      blobSize: audioBlob.size,
      blobType: audioBlob.type
    });

    // Make the API call
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};

export const generateSummary = async (transcript: string): Promise<string> => {
  try {
    if (!transcript.trim()) {
      return "No transcript available to summarize.";
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Create a concise bullet-point summary of the following transcript. Focus on key points and action items."
          },
          {
            role: "user",
            content: transcript
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Summary generation error:', error);
    throw error;
  }
}; 