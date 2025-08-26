# 🤖 AI Product Advisor App

An **AI-powered product advisor** built with **React Native (Expo)**.  
Users describe their needs in plain English (e.g., *"I need a lightweight laptop for travel with a long battery life"*)  
and the application recommends the **best matching products** from a catalog with explanations.

---

## 🎯 Goal of the Project  
The goal was to move beyond **traditional keyword search** and build an application that understands **natural language queries**.  
The app recommends the most relevant products from a catalog and explains *why* each product fits the request.

---

## 🛠️ How I Developed This Project  
1. **UI/UX Design**  
   - Clean, mobile-first **dark theme** for better readability.  
   - Simple workflow: `User Query → AI Ranker → Recommendations`.  

2. **Core Logic**  
   - Local fallback ranker (`fallbackRank`) matches products based on category, budget, and relevance.  
   - Designed for **LLM integration** (Gemini/OpenAI) for smarter AI-based recommendations.  

3. **Code Architecture**  
   - Modular structure with separation of concerns:  
     - `App.js` → entry point  
     - `AdvisorScreen.js` → container + state management  
     - `catalog.js` → product catalog (data)  
     - `ProductCard.js` → UI for displaying recommendations  

4. **State Management**  
   - Managed with React hooks (`useState`) for `query`, `results`, `localMode`, etc.  
   - API-ready: `recommend()` can switch between **local ranking** and **AI API call**.

---

## 🌟 Important Features  
- **Natural Language Input** → users describe needs in plain English.  
- **Dual Recommendation Modes**:  
  - Local (deterministic, offline)  
  - Remote (AI/LLM-powered, future-ready)  
- **Transparent Results** → each recommendation shows a rationale + match score.  
- **Ranking System** → recommendations are ordered with relevance scores.  
- **Cross-Platform** → runs on web, iOS, and Android via **Expo Snack/Go**.  
- **Extensible** → easy to add new products, categories, or AI integrations.

---

## 🛠️ Skills Used  
1. **React Native & Expo** → Built a cross-platform mobile app with modern hooks.  
2. **AI Integration & Prompt Engineering** → Designed prompts and ranking for AI models.  
3. **Software Architecture & Code Quality** → Modular, reusable components with clear separation of concerns.  
4. **Data Handling & Search Logic** → Query parsing, scoring, and ranking heuristics for recommendations.  

---

## 📂 Project File Structure  
```
/AI Product Advisor App
|-- /src
|   |-- /components       # Reusable UI components (e.g., ProductCard.js)
|   |-- AdvisorScreen.js  # Main screen (logic + state management)
|   |-- catalog.js        # Product catalog data (array of objects)
|-- App.js                # Root component (entry point)
|-- README.md             # Documentation and explanation
|-- ai_conversation_log.md # AI usage log (conversations with ChatGPT/Copilot)
|-- package.json          # Project dependencies & metadata
```

---

## ✅ How This Meets the Evaluation Criteria  

### 1) UI/UX & Creativity  
- Dark theme with polished mobile-first design.  
- Natural language flow (query → recommend → results).  
- Transparent results with rationale & scores.  

### 2) Code Quality & Architecture  
- Modular & clean structure (`App.js`, `AdvisorScreen.js`, `catalog.js`, `ProductCard.js`).  
- Separation of UI, logic, and data.  
- Testable fallback ranker with heuristics for category & budget.  

### 3) API & State Management  
- State handled with React hooks (`useState`).  
- `recommend()` async-ready for local or AI API calls.  
- Works offline with fallback ranker, and future-ready for Gemini/OpenAI integration.  

### Prompting Strategy for AI Integration  
When wired to an LLM, the prompt is designed to:  
- Take the user query + catalog as input.  
- Ask the AI to return a ranked JSON response:  
  ```json
  {
    "recommendations": [
      { "id": "<catalog_id>", "score": <0-10>, "rationale": "why it fits" }
    ]
  }
  ```
- Ensures transparent, structured, and consistent recommendations.

---

## 🚀 Running the Project  

1. Open with **Expo Snack**: upload this repo or copy code.  
2. Or run locally:  
   ```bash
   npm install
   npx expo start
   ```  
3. Open in **Expo Go** (scan QR code) or test in Web/iOS/Android simulators.

---

## 📌 Next Steps (Future Work)  
- Integrate **Google Gemini / OpenAI API** for AI-driven recommendations.  
- Add **debouncing, loading, and error states** for production readiness.  
- Expand catalog with richer product metadata.  

---
