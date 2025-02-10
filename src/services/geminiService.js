const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_VISION_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

const convertImageToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateGeminiResponse = async (message, chatHistory = [], onUpdate = () => {}, imageFile = null) => {
  try {
    let messages = [
      {
        role: 'user',
        parts: [{ text: 'Kamu adalah Zyra AI yang berbicara dengan gaya bahasa Jakarta Selatan (Jaksel) tapi jangan terlalu kasar. Gunakan bahasa yang santai, modern, dan sering mencampur Bahasa Indonesia dengan Bahasa Inggris tapi jangan terlalu sering. Contoh: "Anyway gue prefer pake cara yang simple sih, which is basically lebih effortif". Tetap profesional tapi friendly dan relatable. Hindari bahasa yang terlalu formal. Jangan memulai respon dengan kalimat seperti "Oke, mari kita bahas..." atau sejenisnya. Langsung saja ke inti pembahasan dengan gaya santai.' }]
      },
      ...chatHistory.map(msg => ({
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    ];

    const apiUrl = imageFile ? GEMINI_VISION_API_URL : GEMINI_API_URL;
    let requestBody = {
      contents: messages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    };

    if (imageFile) {
      const base64Image = await convertImageToBase64(imageFile);
      requestBody.contents.push({
        role: 'user',
        parts: [
          { text: message },
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image
            }
          }
        ]
      });
    } else {
      requestBody.contents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    }

    const response = await fetch(`${apiUrl}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Sorry banget nih, ada error pas communicate sama AI. Try again later ya!');
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text || '';
    onUpdate(generatedText);
    return generatedText;

  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Sorry banget nih, ada error. Coba lagi later ya!');
  }
}; 