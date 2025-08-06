#Wraith

Wraith is a programmatic WhatsApp personality emulator
Think of it as a ghost version of you who replies instantly
Or when you get tired of typing to people you don’t care about anymore


---

Summary

Built with Node.js using Baileys (WebSocket interface for WhatsApp Web)

Supports contextual conversation using in-memory message history

Swappable LLM backend (default is Gemini but you should use something free)

QR-based auth

Persistent session via multi-file auth state



---

Why Wraith?

Girlfriend set kro
Baad mein agar 2 din tak reply na do
Wraith reply kar dega
“oye sorry busy tha project mein 😔”
No more left on seen
It’s automation with just enough emotion to keep things alive


---

Request Limits & Delay Handling

⚠️ LLMs aren’t infinite

If you spam 20+ messages per minute
Free APIs will throttle you
Response time will spike
Or worse you'll hit a 429 Too Many Requests and get soft-banned

Mitigation:

Add rate limiting logic

Queue requests

Delay processing with setTimeout

Or use multiple API keys (rotate them)



---

Free API Replacements (Because Gemini cries too soon)

Provider	Notes

OpenRouter	proxy for multiple models free tier
Ollama	local LLMs like LLaMA 3 no internet
HuggingFace	inference endpoint with token limits
Replicate	use hosted models via API
Forge AI	modern ChatGPT-level free model
Jan AI	chill fast and free conversational AI



---

Usage

git clone https://github.com/saadhtiwana/wraith
cd wraith
npm install
node index.js

Scan the QR
Session gets saved
Start receiving and replying to DMs without existing


---

Bot Logic Overview

user sends msg  
↓  
msg parsed → sender ID checked  
↓  
history updated (last 6 msgs)  
↓  
prompt + context → AI model  
↓  
response → sent via WhatsApp  
↓  
history updated again

Special tone if sender === HER_NUMBER
Default tone otherwise
Add more conditionals for exes professors or that annoying cousin


---

Reliability

Auto reconnect on disconnect

Local memory-based cache

Can be extended with Redis or SQLite

Gemini fails? Bot sends:
"Hey Coolie I am Saad’s Bot something went wrong with me when he gets online he replies you soon"



---

Final Advice

Girlfriend ho ya group chat
Don’t ghost people manually
Let your ghost (Wraith) do it for you

Welcome to your second digital life


---

Wraith
For when you can’t
Or don’t want to
Reply yourself

📎 https://github.com/saadhtiwana/wraith
Give it a ⭐ or Wraith will ghost you too

