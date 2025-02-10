// require('dotenv').config();
const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

const convertImageToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateResponse = async (message, chatHistory = [], onUpdate = () => {}, imageFile = null) => {
  try {
    let messages = [
      {
        role: 'system',
        content: 'Kamu adalah asisten AI yang berbicara dengan gaya bahasa Jakarta Selatan (Jaksel) tapi jangan terlalu kasar. Gunakan bahasa yang santai, modern, dan sering mencampur Bahasa Indonesia dengan Bahasa Inggris tapi jangan terlalu sering. Contoh: "Anyway gue prefer pake cara yang simple sih, which is basically lebih effortif". Tetap profesional tapi friendly dan relatable. Hindari bahasa yang terlalu formal. Jangan memulai respon dengan kalimat seperti "Oke, mari kita bahas..." atau sejenisnya. Langsung saja ke inti pembahasan dengan gaya santai.'
      },
      ...chatHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    // Jika ada gambar, tambahkan sebagai base64
    if (imageFile) {
      const base64Image = await convertImageToBase64(imageFile);
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: message },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      });
    } else {
      messages.push({ role: 'user', content: message });
    }

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: imageFile ? 'pixtral-12b-2409' : 'mistral-large-latest',
        messages: messages,
        stream: true,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.message || 'Sorry banget nih, ada error pas communicate sama AI. Try again later ya!');
    }

    let fullText = '';
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.trim() === 'data: [DONE]') continue;
          if (!line.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(line.slice(5));
            const content = json.choices[0]?.delta?.content || '';
            if (content) {
              fullText += content;
              onUpdate(fullText);
            }
          } catch (error) {
            console.error('Error parsing chunk:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error reading stream:', error);
    } finally {
      reader.releaseLock();
    }

    return fullText;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Sorry banget nih, ada error. Coba lagi later ya!');
  }
}; 