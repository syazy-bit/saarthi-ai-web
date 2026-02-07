# Saarthi AI - Government Scheme Discovery Assistant

![Saarthi AI](https://img.shields.io/badge/Status-MVP-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**Saarthi AI** is a multilingual AI assistant that helps citizens discover government schemes, scholarships, and welfare programs they are eligible for. Built with a focus on **transparency, trust, and accessibility**.

## 🌟 Features

- **Multilingual Support**: English and Assamese (expandable to more languages)
- **AI-Powered Extraction**: Uses Gemini AI to extract user information from natural language
- **Rule-Based Eligibility**: Deterministic, explainable eligibility matching (not AI black box)
- **Vibrant Modern UI**: Professional gradient design with smooth animations
- **Scheme Discovery**: Browse and search government schemes
- **Trust Indicators**: Clear badges showing rule-based decisions

## 🛠️ Tech Stack

### Frontend
- **React** with Vite
- **Vanilla CSS** with modern design tokens
- **Google Fonts** (Space Grotesk, Poppins, Noto Sans Bengali)

### Backend
- **Node.js** + Express
- **Gemini 2.5 Flash Lite** for NLU
- **JSON-based scheme database** (easily upgradable to SQL/NoSQL)

## 📁 Project Structure

```
saarthi-ai-web/
├── frontend/
│   ├── src/
│   │   ├── components/    # ChatInterface, SchemeCard, LanguageToggle
│   │   ├── pages/         # Home.jsx
│   │   ├── services/      # api.js (centralized API calls)
│   │   └── styles/        # main.css (design system)
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # LLM & eligibility logic
│   │   ├── data/          # schemes.json
│   │   └── utils/         # Helper functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/saarthi-ai-web.git
   cd saarthi-ai-web
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create `backend/.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Server runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App opens at `http://localhost:5173`

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/schemes` | GET | List all schemes |
| `/api/schemes/:id` | GET | Get scheme by ID |
| `/api/chat` | POST | Main chat endpoint |

## 🎨 Design Philosophy

- **Vibrant & Modern**: Moving away from generic purple gradients to dynamic indigo-purple-pink palettes
- **Trusted Expert**: Professional, trustworthy, distinct visual identity
- **Accessible**: Clear typography, good contrast, readable UI

## 🔒 Safety & Trust

- **Rule-Based Eligibility**: No AI hallucinations in eligibility decisions
- **Graceful Degradation**: If AI fails, system still responds (no 500 errors)
- **Transparent**: Shows why users qualify for schemes
- **User Control**: AI assists, official authorities decide final eligibility

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Google's Gemini AI
- Focused on serving citizens of Assam (expandable to all of India)
- Inspired by the need for accessible government information

---

**Made with ❤️ for the people of Assam**
