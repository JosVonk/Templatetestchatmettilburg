# 🏒 Sports Marketing Interview Bot

> **Een interactieve AI-chatbot waarmee studenten marketing managers van sportmerken kunnen interviewen**
>
> **Gemaakt voor marketing- en sport business onderwijs**

Een gespecialiseerde Next.js applicatie die studenten de mogelijkheid geeft om realistische gesprekken te voeren met AI-gestuurde marketing managers van toonaangevende sportmerken. Perfect voor het leren over merkstrategie, sponsoring, en uitdagingen in de sportindustrie.

## ✨ Features

### 🎯 **Educatieve Gesprekken**
- 🧠 **Realistische Personas**: Gedetailleerde marketing manager karakters met echte branche-expertise
- 💬 **Interactieve Interviews**: Natuurlijke gesprekken over marketing strategieën
- 📚 **Leergerichte Content**: Praktische inzichten die studenten kunnen toepassen
- 🎓 **Voor Studenten**: Speciaal ontworpen voor marketing en sport business onderwijs

### 🏒 **Sportmerk Focus**
- **Dita Hockey**: Nederlandse premium hockeymerk sinds 1891
- 🌟 **Meer merken**: Uitbreidbaar naar andere sportmerken
- 🏆 **Echte Branche Inzichten**: Gebaseerd op werkelijke uitdagingen en trends
- 🎯 **Specifieke Expertise**: Van sponsoring tot internationale expansie

### 🚀 **Technische Features**
- ⚡ **Real-time Streaming**: Live AI responses voor natuurlijke gesprekken
- 📱 **Responsive Design**: Werkt perfect op alle apparaten
- 🔊 **Text-to-Speech**: Luister naar de antwoorden van marketing managers
- 📄 **Export Functionaliteit**: Download gesprekken als Word documenten
- 📋 **Copy to Clipboard**: Eenvoudig delen van inzichten

## 🚀 Quick Start

### Stap 1: 🔑 API Key Verkrijgen
Verkrijg een gratis Gemini API key van [Google AI Studio](https://makersuite.google.com/app/apikey)

### Stap 2: 🛠️ Project Setup
```bash
# Clone het project
git clone [repository-url]
cd sports-marketing-interview-bot

# Dependencies installeren
npm install

# Environment variables
cp .env.example .env.local
# Edit .env.local en voeg je API key toe:
# GEMINI_API_KEY=your_gemini_api_key_here
```

### Stap 3: 🎉 Start & Test
```bash
npm run dev
# Open http://localhost:3000
# Begin je eerste interview met Sarah van der Berg van Dita Hockey!
```

### Stap 4: 🚀 Deploy naar Netlify
1. **In Bolt.new**: "Deploy to Netlify"
2. **Environment Variables toevoegen** in Netlify dashboard:
   - `GEMINI_API_KEY` (vereist)
3. **Deploy** en je app is live!

## 🎭 Marketing Manager Personas

### 🏒 Sarah van der Berg - Dita Hockey
**Achtergrond:**
- 8 jaar ervaring in sportmarketing
- Voormalig hockeyster op nationaal niveau
- Master in Sport Business Management
- Gespecialiseerd in premium merkpositionering

**Expertise:**
- Premium merkpositionering
- Sponsoring en partnerships
- Internationale marktexpansie
- Product marketing voor sportuitrusting
- Digital marketing in sport
- Influencer marketing met atleten
- Retail en distributie strategieën
- Merkactivatie tijdens toernooien

**Over Dita:**
- Nederlands premium hockeymerk sinds 1891
- Bekend om CompoTec technologie
- Gebruikt door topspelers wereldwijd
- Sterke aanwezigheid in Europa, Azië en Oceanië
- Focus op innovatie, kwaliteit en Nederlandse vakmanschap

## 📚 Educatieve Toepassingen

### 👨‍🏫 **Voor Docenten**
- 🎯 **Praktijkgerichte Lessen**: Laat studenten echte marketing uitdagingen ontdekken
- 📊 **Case Study Material**: Gebruik gesprekken als basis voor analyses
- 🎓 **Assessment Tool**: Beoordeel studenten op hun interviewvaardigheden
- 💡 **Inspiratie voor Projecten**: Studenten kunnen eigen merkstrategieën ontwikkelen

### 👩‍🎓 **Voor Studenten**
- 🗣️ **Interview Skills**: Oefen het stellen van de juiste vragen
- 🧠 **Branche Inzicht**: Leer over echte uitdagingen in sportmarketing
- 📈 **Strategisch Denken**: Begrijp hoe merkpositionering werkt
- 🌍 **Internationale Perspectieven**: Ontdek globale marketing strategieën

### 🏫 **Curriculum Integratie**
- **Marketing Management**: Merkstrategie en positionering
- **Sport Business**: Sponsoring en partnerships
- **International Business**: Globale expansie strategieën
- **Digital Marketing**: Social media en influencer marketing
- **Consumer Behavior**: Doelgroep analyse in sport

## 🛠️ Technical Architecture

### 📂 **Project Structure**
```
├── 🔑 .env.local                 # API Keys
├── 📦 package.json               # Dependencies
├── ⚙️ next.config.js             # Next.js configuration
└── src/
    ├── 🎨 app/
    │   ├── 🌍 globals.css         # Styling
    │   ├── 📱 layout.tsx          # App layout
    │   ├── 🏠 page.tsx            # Main page
    │   └── 🔌 api/
    │       └── 💬 chat-stream/route.ts  # Streaming AI endpoint
    └── 🧩 components/
        ├── 🏒 SportsChatBot.tsx   # Main chat interface
        ├── 📝 MarkdownRenderer.tsx # Response formatting
        └── ⚙️ ResponseActions.tsx  # TTS, Copy, Export
```

### 🔌 **API Integration**
- **Gemini 2.5 Flash**: Snelle, hoogkwaardige AI responses
- **Streaming Responses**: Real-time conversatie ervaring
- **Context Awareness**: Houdt gesprekgeschiedenis bij
- **Persona Consistency**: Blijft in karakter gedurende het gesprek

## 🎯 Voorbeeldvragen voor Studenten

### 📊 **Merkstrategie & Positionering**
- "Hoe positioneert Dita zich ten opzichte van concurrenten zoals Grays en TK?"
- "Wat maakt Dita uniek in de hockeymarkt?"
- "Hoe communiceren jullie de premium positionering naar consumenten?"

### 🤝 **Sponsoring & Partnerships**
- "Hoe selecteren jullie atleten voor sponsordeals?"
- "Wat is het ROI van sponsoring van nationale teams?"
- "Hoe meten jullie het succes van partnerships?"

### 🌍 **Internationale Expansie**
- "Welke uitdagingen hebben jullie bij het betreden van nieuwe markten?"
- "Hoe passen jullie de merkboodschap aan per land?"
- "Wat is jullie strategie voor de Aziatische markt?"

### 📱 **Digital Marketing**
- "Hoe gebruiken jullie social media voor merkactivatie?"
- "Wat is jullie strategie voor influencer marketing?"
- "Hoe meten jullie online engagement?"

### 🏆 **Uitdagingen & Trends**
- "Wat zijn de grootste uitdagingen in hockeymarketing?"
- "Hoe reageren jullie op veranderende consumentengedrag?"
- "Welke trends zien jullie in de sportindustrie?"

## 🔧 Uitbreidingsmogelijkheden

### 🏀 **Meer Sportmerken**
- **Nike Basketball**: Global brand strategy
- **Adidas Football**: Sponsoring en partnerships
- **Specialized Cycling**: Premium fietsmarkt
- **Wilson Tennis**: Racket sport marketing
- **Burton Snowboarding**: Lifestyle marketing

### 🎯 **Extra Features**
- **Multi-language Support**: Engels, Duits, Frans
- **Video Responses**: AI-gegenereerde video interviews
- **Assessment Mode**: Automatische beoordeling van vragen
- **Group Interviews**: Meerdere studenten tegelijk
- **Historical Data**: Vergelijk strategieën door de tijd

### 📊 **Analytics Dashboard**
- **Student Progress**: Track leervoortgang
- **Popular Questions**: Meest gestelde vragen
- **Engagement Metrics**: Gespreksduur en diepte
- **Learning Outcomes**: Educatieve effectiviteit

## 🚀 Production Deployment

### 🌐 **Netlify (Aanbevolen)**
```bash
# Build voor productie
npm run build

# Environment variables instellen:
GEMINI_API_KEY=your_api_key_here
NODE_ENV=production
```

### ⚡ **Performance Optimizations**
- **Streaming Responses**: Snelle, real-time conversaties
- **Efficient Prompting**: Geoptimaliseerde AI prompts
- **Caching**: Smart caching van responses
- **Mobile Optimized**: Perfect op alle apparaten

## 🎓 Educatieve Impact

### 📈 **Leerresultaten**
- **Praktische Kennis**: Echte branche inzichten
- **Interview Skills**: Betere vraagstelling
- **Strategisch Denken**: Begrip van merkstrategie
- **Branche Awareness**: Kennis van sportmarketing

### 🏆 **Success Stories**
- Studenten ontwikkelen betere marketing plannen
- Verhoogde engagement in marketing lessen
- Praktische voorbereiding op stage/werk
- Dieper begrip van sport business

## 🤝 Contributing & Development

### 🛠️ **Development Setup**
```bash
# Development mode
npm run dev

# Type checking
npm run lint

# Production build test
npm run build && npm start
```

### 🔄 **Adding New Personas**
1. Voeg nieuwe manager toe aan `MARKETING_MANAGERS` object
2. Definieer achtergrond, expertise en persoonlijkheid
3. Test de persona met verschillende vraagtypen
4. Update documentatie en voorbeeldvragen

## 📞 Support & Contact

### 🔗 **Resources**
- [Gemini API Docs](https://ai.google.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Netlify Deployment](https://netlify.com)

### 💡 **Community**
- GitHub Issues voor bug reports
- Feature requests welkom
- Educatieve feedback gewaardeerd

---

## 🎉 **Klaar om te Starten?**

Deze Sports Marketing Interview Bot biedt studenten een unieke kans om te leren van ervaren marketing professionals in de sportindustrie. Van merkstrategie tot internationale expansie - alle aspecten van sportmarketing komen aan bod in realistische, interactieve gesprekken.

**🏒 Start nu je eerste interview met Sarah van Dita Hockey!**

---

*Sports Marketing Interview Bot v1.0*  
*Voor educatieve doeleinden • Powered by Gemini AI*  
*Last updated: December 2024*