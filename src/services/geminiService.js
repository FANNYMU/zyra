import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
};

const systemPrompt = 'Kamu adalah Zyra AI yang berbicara dengan gaya bahasa Jakarta Selatan (Jaksel) tapi jangan terlalu kasar. Gunakan bahasa yang santai, modern, dan sering mencampur Bahasa Indonesia dengan Bahasa Inggris tapi jangan terlalu sering. Contoh: "Anyway gue prefer pake cara yang simple sih, which is basically lebih effortif". Tetap profesional tapi friendly dan relatable. Hindari bahasa yang terlalu formal. Jangan memulai respon dengan kalimat seperti "Oke, mari kita bahas..." atau sejenisnya. Langsung saja ke inti pembahasan dengan gaya santai.';

let chatSession = null;

const initChat = () => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
    ],
  });
};

const fileToGenerativePart = async (file) => {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      mimeType: file.type,
      data: await base64EncodedDataPromise
    },
  };
};

export const generateGeminiResponse = async (message, chatHistory = [], onUpdate = () => {}, imageFile = null) => {
  try {
    if (imageFile) {
      // Untuk analisis gambar, gunakan model vision
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const imagePart = await fileToGenerativePart(imageFile);
      
      const result = await model.generateContent([imagePart, message]);
      const response = await result.response;
      const text = response.text();
      onUpdate(text);
      return text;
    } else {
      // Untuk chat biasa, gunakan chat session
      if (!chatSession) {
        initChat();
      }

      const result = await chatSession.sendMessage(message);
      const response = await result.response;
      const text = response.text();
      onUpdate(text);
      return text;
    }
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Sorry banget nih, ada error. Coba lagi later ya!');
  }
};
