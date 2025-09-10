# 👻 WRAITH 2.0
## *Your AI Digital Twin That Never Sleeps*

> **"Bro replied faster than light... sus af"**  
> **"Wait, you were online at 3 AM? Thought you were sleeping"**  
> **"This guy's reply game is unmatched, teach me senpai"**

---

### 🔥 THE ULTIMATE FLEX

**Tired of replying to 47 different WhatsApp convos?**  
**Want your crush to think you're always available but mysteriously busy?**  
**Need to ghost people WITHOUT actually ghosting them?**

**Welcome to Wraith 2.0** - The most sophisticated WhatsApp personality emulator that makes you look like a 24/7 available legend while you're actually touching grass.

---

## 🚀 WHAT'S NEW IN 2.0?

### 🧠 **AI TRINITY SYSTEM**
- **Multi-AI fallback**: Gemini → OpenAI → HuggingFace
- No more "API quota exceeded" L's
- Always responds, even if one AI provider is down

### 🎭 **DYNAMIC PERSONALITIES**
- **Romantic mode** for your special someone 💕
- **Casual mode** for the homies 🤝
- **Respectful mode** for family 👨‍👩‍👧‍👦
- **Professional mode** for work contacts 💼
- **Smart learning** - adapts to each person's vibe

### ⚡ **HUMAN-LIKE BEHAVIORS**
```javascript
// Real human timing simulation
Auto-delays: 2-8 seconds (customizable)
Typing indicators: Shows "typing..." 
Smart delays: Urgent messages = faster replies
Long messages = longer thinking time
```

### 🛡️ **ANTI-SPAM PROTECTION**
- Rate limiting: Max 15 msgs/minute per contact
- Smart ignore system for irrelevant messages
- Auto-throttling to prevent API burns

### 📱 **MEDIA INTELLIGENCE**
- Handles images, videos, voice notes, documents
- Context-aware responses to media
- "Nice pic! 📸" level intelligence

### 📊 **PERSONALITY LEARNING ENGINE**
```javascript
// The bot literally learns each person's vibe
Formality detection: "Sir" vs "Bro"
Enthusiasm matching: Matches energy levels
Topic memory: Remembers conversation themes
```

### 🕒 **AUTO-STATUS UPDATES**
- Changes WhatsApp status every 4 hours
- Pre-loaded with "busy building the future 🚀" type flexes
- Makes you look perpetually productive

### 💾 **PERSISTENT MEMORY**
- Remembers conversations across restarts
- Saves personality profiles
- Context-aware responses

---

## 🎯 THE SAAD SPECIAL: FINE-TUNED PERSONALITIES

### Want to take this to GOD-TIER level?

**Create a fine-tuned model with YOUR specific data:**

1. **Export your WhatsApp chats** with different people
2. **Feed the data to a fine-tuning service**:
   - OpenAI Fine-tuning API
   - Google AI Studio
   - Hugging Face AutoTrain
   - Local LLaMA fine-tuning

3. **Train on YOUR conversation style**:
   ```
   How YOU text your girlfriend vs friends vs family
   Your humor patterns, emoji usage, slang
   Response timings and conversation flow
   ```

4. **Deploy your digital twin**:
   - Replace the AI queries with your fine-tuned model
   - Now Wraith doesn't just reply - it replies EXACTLY like you
   - Turing test level mimicry

**Pro tip**: Fine-tune on different relationship dynamics for maximum authenticity.

---

## 📦 INSTALLATION & SETUP

### Prerequisites
```bash
Node.js 16+
WhatsApp account (duh)
At least one AI API key
```

### Quick Start
```bash
git clone https://github.com/saadhtiwana/wraith
cd wraith
npm install
```

### Environment Setup
Create `.env` file:
```env
# At least one of these is required
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here  
HUGGINGFACE_API_KEY=your_hf_key_here
```

### Configure Your Contacts
Edit the `CONTACTS` object in `index.js`:
```javascript
const CONTACTS = {
  'her': {
    number: 'girlfriend_number@s.whatsapp.net',
    personality: 'romantic',
    replyChance: 0.9, // 90% reply rate
    avgResponseTime: 3000 // 3 second delay
  },
  'bestfriend': {
    number: 'bestie_number@s.whatsapp.net', 
    personality: 'casual',
    replyChance: 0.8,
    avgResponseTime: 5000
  }
  // Add more contacts...
}
```

### Launch Your Ghost
```bash
node index.js
```
Scan QR code → You're now immortal on WhatsApp 👻

---

## ⚙️ ADVANCED CONFIGURATION

### Personality Customization
```javascript
const CONFIG = {
  MESSAGE_HISTORY_LIMIT: 10,        // Conversation memory
  RATE_LIMIT_PER_MINUTE: 15,        // Anti-spam protection
  AUTO_REPLY_DELAY: { min: 2000, max: 8000 }, // Human-like timing
  TYPING_SIMULATION: true,          // Shows typing indicator
  SMART_DELAYS: true,               // Context-aware delays
  PERSONALITY_LEARNING: true        // Learns from interactions
}
```

### Custom Status Messages
```javascript
const statuses = [
  "Busy building the future 🚀",
  "In the zone 🎯",
  "Coffee + Code = ❤️",
  "Making magic happen ✨",
  "Unavailable but Wraith got you 👻"
]
```

---

## 🎮 USAGE SCENARIOS

### 1. **The Girlfriend Buffer** 💕
```
Her: "Why didn't you reply?"
Wraith: "Sorry babe, was in a meeting 😔 Miss you"
You: *Actually was playing games for 3 hours*
```

### 2. **The Friend Zone Maintainer** 🤝
```
Random person: "Hey, wanna hang out?"
Wraith: "Yo! Super busy with projects rn, rain check? 🙏"
You: *Avoiding social interaction like a pro*
```

### 3. **The Professional Juggler** 💼
```
Work contact: "Can you finish this by tonight?"
Wraith: "Currently reviewing the requirements. Will update you with timeline shortly."
You: *Haven't even opened the laptop*
```

### 4. **The Family Diplomat** 👨‍👩‍👧‍👦
```
Mom: "Beta, call karo jaldi"
Wraith: "Bas 5 minute mein call kar raha hun Mama ❤️"
You: *Preparing mentally for the inevitable lecture*
```

---

## 🔥 THE WRAITH ADVANTAGE

### Why Choose Wraith Over Manual Texting?

| Manual Texting | Wraith 2.0 |
|---|---|
| ❌ Forget to reply for days | ✅ Never leaves anyone on read |
| ❌ Different energy levels affect replies | ✅ Consistent personality 24/7 |
| ❌ Can't handle multiple convos | ✅ Manages unlimited conversations |
| ❌ Late night texts are ignored | ✅ Responds instantly at 3 AM |
| ❌ Generic responses get boring | ✅ Context-aware, personalized replies |
| ❌ Your mood affects relationships | ✅ Always in the perfect mood |

---

## 🛠️ TECHNICAL ARCHITECTURE

### Multi-AI Fallback System
```
Message Received
    ↓
Rate Limit Check
    ↓
Personality Detection
    ↓
Context Building (Last 10 messages)
    ↓
AI Provider Selection:
    1. Gemini (Primary)
    2. OpenAI (Fallback)
    3. HuggingFace (Last Resort)
    ↓
Smart Delay Calculation
    ↓
Typing Simulation
    ↓
Response Delivery
    ↓
Memory Update
```

### Data Persistence
```
📁 Project Structure
├── auth_info/           # WhatsApp session data
├── user_histories.json  # Conversation memory
├── user_personalities.json # Learned personality data
├── .env                # API keys (DO NOT COMMIT)
└── index.js            # The ghost itself
```

---

## 🚨 ETHICAL USAGE DISCLAIMER

**Use Responsibly:**
- Don't use for deception or manipulation
- Inform close friends/family if they ask directly
- Don't use for business-critical communications
- Respect other people's time and emotions

**This is for:**
- ✅ Managing overwhelming message load
- ✅ Maintaining relationships during busy periods
- ✅ Learning conversation AI development
- ✅ Staying responsive without being glued to phone

---

## 🤝 CONTRIBUTION & COMMUNITY

### Want to Make Wraith Even Better?

**Ideas for contributors:**
- Voice message transcription + response
- Image recognition and contextual replies
- Integration with calendar for time-based personalities
- WhatsApp Business API integration
- Sentiment analysis for mood matching
- Multi-language support
- Group chat management
- Auto-reaction system

### Fine-Tuning Community
Join our Discord/Telegram for:
- Sharing fine-tuned models
- Best practices for data collection
- Personality prompt engineering
- Advanced deployment strategies

---

## 📈 ROADMAP

### v2.1 - The Emotion Engine
- [ ] Sentiment analysis for mood matching
- [ ] Emotional context memory
- [ ] Empathy-based responses

### v2.2 - The Multimedia Master
- [ ] Image generation responses
- [ ] Voice message synthesis
- [ ] Video understanding

### v2.3 - The Social Butterfly
- [ ] Group chat management
- [ ] Social graph analysis
- [ ] Relationship priority scoring

### v3.0 - The Consciousness Update
- [ ] Full personality fine-tuning pipeline
- [ ] Real-time learning from interactions
- [ ] Behavioral pattern prediction

---

## 🏆 SUCCESS STORIES

> *"My girlfriend thinks I became the perfect boyfriend. Little does she know..."* - Anonymous Chad

> *"Went on a 2-week trip, came back to 47 happy conversations and zero drama"* - Digital Nomad

> *"My mom finally stopped complaining about my response time"* - Satisfied Son

---

## 💡 PRO TIPS

### 1. **The Perfect Setup**
- Use different API keys for different contact tiers
- Set up custom delays for each relationship type
- Regularly update your personality prompts

### 2. **Advanced Strategies**
- Export your actual chat history for fine-tuning data
- Use conversation analytics to optimize personalities
- Set up monitoring to catch API failures

### 3. **Stealth Mode**
- Don't reply TOO perfectly (add some delays)
- Occasionally let some messages go unanswered
- Mix in some typos for authenticity

---

## ⚡ GET STARTED NOW

```bash
git clone https://github.com/saadhtiwana/wraith
cd wraith
npm install
# Add your API keys to .env
# Configure your contacts
node index.js
# Scan QR code
# Become legendary 👻
```

---

### 🌟 **Give Wraith a Star on GitHub**
#### *Or Wraith will ghost you too* 😈

**Built with 💜 by [Saad](https://github.com/saadhtiwana)**  
*Making digital relationships effortless, one message
