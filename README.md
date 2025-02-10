# 🤖 Zyra Chatbot

<div align="center">
  <img src="./public/zyra.png" alt="Zyra Logo" width="120"/>
  <p><i>Asisten AI dengan Gaya Bahasa Jakarta Selatan yang Friendly dan Relatable</i></p>
</div>

## 📱 Fitur Utama

- **💬 Chat Interface Modern**
  - UI/UX yang clean dan responsive
  - Animasi smooth untuk pengalaman yang lebih immersive
  - Dark mode & light mode
  
- **🎯 Kemampuan AI**
  - Berbicara dengan gaya Jaksel yang natural
  - Streaming response untuk interaksi real-time
  - Markdown support untuk formatting teks
  
- **💾 Manajemen Chat**
  - Penyimpanan chat history dengan IndexedDB
  - Fitur buat chat baru
  - Hapus chat individual atau semua chat
  
- **⚙️ Kustomisasi**
  - Toggle dark/light mode
  - Pengaturan suara
  - Pilihan bahasa (Indonesia/English)

## 🚀 Teknologi yang Digunakan

- **Frontend Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Animasi**: Framer Motion
- **AI**: Mistral AI API
- **Storage**: IndexedDB
- **Icons**: Lucide Icons

## 💻 Cara Menjalankan Lokal

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/zyra-chatbot.git
   cd zyra-chatbot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   ```bash
   # Buat file .env
   VITE_MISTRAL_API_KEY=your_api_key_here
   ```

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

5. **Buka Browser**
   ```
   http://localhost:5173
   ```

## 📱 Responsive Design

- **Desktop**: Full sidebar dengan daftar chat
- **Tablet**: Sidebar collapsible
- **Mobile**: Sidebar auto-hide dengan toggle button

## 🎨 Fitur UI/UX

- **Smooth Animations**
  - Typing effect untuk pesan user
  - Fade & slide transitions
  - Interactive hover effects
  
- **Modern Interface**
  - Glassmorphism design
  - Gradient buttons
  - Custom scrollbar

## 🔒 Privacy & Security

- Data chat disimpan secara lokal menggunakan IndexedDB
- Tidak ada data yang dikirim ke server selain interaksi dengan AI
- API key tersimpan aman di environment variables

## 📝 To-Do & Pengembangan

- [ ] Implementasi voice chat
- [ ] Tambah fitur export chat history
- [ ] Integrasi dengan lebih banyak AI model
- [ ] Tambah fitur custom prompt
- [ ] Implementasi PWA

## 🤝 Kontribusi

Kontribusi selalu welcome! Silakan buat pull request atau buka issue untuk saran dan perbaikan.

## 📄 Lisensi

Project ini dilisensikan di bawah [MIT License](LICENSE)

---

<div align="center">
  <p>Made with ❤️ by Chandra</p>
  <p>Powered by Mistral AI</p>
</div>
