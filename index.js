require('dotenv').config()
const { makeWASocket, DisconnectReason, useMultiFileAuthState, downloadMediaMessage } = require('@whiskeysockets/baileys')
const axios = require('axios')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const cron = require('node-cron')

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY

if (!GEMINI_API_KEY && !OPENAI_API_KEY && !HUGGINGFACE_API_KEY) {
  console.error(chalk.red('❌ No API keys found! Add at least one: GEMINI_API_KEY, OPENAI_API_KEY, or HUGGINGFACE_API_KEY'))
  process.exit(1)
}

const CONFIG = {
  MESSAGE_HISTORY_LIMIT: 10,
  RATE_LIMIT_PER_MINUTE: 15,
  AUTO_REPLY_DELAY: { min: 2000, max: 8000 },
  TYPING_SIMULATION: true,
  SMART_DELAYS: true,
  PERSONALITY_LEARNING: true
}

const CONTACTS = {
  'her': {
    number: '923123456789@s.whatsapp.net',
    personality: 'romantic',
    replyChance: 0.9,
    avgResponseTime: 3000
  },
  'bestfriend': {
    number: '923987654321@s.whatsapp.net', 
    personality: 'casual',
    replyChance: 0.8,
    avgResponseTime: 5000
  },
  'family': {
    number: '923111111111@s.whatsapp.net',
    personality: 'respectful',
    replyChance: 0.95,
    avgResponseTime: 2000
  }
}

const userHistories = {}
const userPersonalities = {}
const rateLimitTracker = {}

function isRateLimited(sender) {
  const now = Date.now()
  if (!rateLimitTracker[sender]) {
    rateLimitTracker[sender] = []
  }
  rateLimitTracker[sender] = rateLimitTracker[sender].filter(time => now - time < 60000)
  if (rateLimitTracker[sender].length >= CONFIG.RATE_LIMIT_PER_MINUTE) {
    return true
  }
  rateLimitTracker[sender].push(now)
  return false
}

function calculateSmartDelay(text, sender) {
  let delay = Math.random() * (CONFIG.AUTO_REPLY_DELAY.max - CONFIG.AUTO_REPLY_DELAY.min) + CONFIG.AUTO_REPLY_DELAY.min
  if (text.length > 100) delay *= 1.5
  const urgentKeywords = ['urgent', 'emergency', 'help', 'asap', 'important']
  if (urgentKeywords.some(word => text.toLowerCase().includes(word))) {
    delay *= 0.3
  }
  const contact = Object.values(CONTACTS).find(c => c.number === sender)
  if (contact) {
    delay = contact.avgResponseTime + (Math.random() * 2000 - 1000)
  }
  return Math.max(delay, 1000)
}

async function askAI(prompt, history, persona, sender) {
  const contextString = history.length > 0 
    ? 'Previous conversation context:\n' + history.map(item => `${item.from === 'user' ? 'User' : 'Bot'}: ${item.text}`).join('\n') + '\n\n'
    : ''
  const personalityPrompts = {
    romantic: `You are the romantic side of Wraith talking to someone special. Be charming caring and slightly flirty. Use emojis moderately. Show genuine interest and affection.`,
    casual: `You are Wraith talking to a close friend. Be relaxed use casual language crack jokes and be supportive. Use local slang occasionally.`,
    respectful: `You are Wraith talking to family. Be respectful caring and proper. Avoid slang and maintain good manners.`,
    professional: `You are Wraith in a professional context. Be courteous clear and helpful while maintaining boundaries.`,
    default: `You are Wraith - a cool friendly bot. Match the energy of the conversation while staying authentic.`
  }
  const systemPrompt = `${personalityPrompts[persona] || personalityPrompts.default}

Current conversation:
${contextString}User: ${prompt}

Reply naturally as Wraith would keeping it conversational. Don't mention you're an AI.`
  const providers = [
    { name: 'Gemini', func: () => queryGemini(systemPrompt) },
    { name: 'OpenAI', func: () => queryOpenAI(systemPrompt) },
    { name: 'HuggingFace', func: () => queryHuggingFace(systemPrompt) }
  ]
  for (const provider of providers) {
    try {
      console.log(chalk.blue(`🤖 Trying ${provider.name}...`))
      const response = await provider.func()
      if (response) {
        console.log(chalk.green(`✅ ${provider.name} responded`))
        return response
      }
    } catch (error) {
      console.log(chalk.yellow(`⚠️ ${provider.name} failed: ${error.message}`))
    }
  }
  return "Hey! I'm a bit busy right now I'll get back to you soon 😊"
}

async function queryGemini(prompt) {
  if (!GEMINI_API_KEY) throw new Error('No Gemini API key')
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`
  const res = await axios.post(GEMINI_URL, {
    contents: [{ parts: [{ text: prompt }] }]
  })
  return res.data.candidates?.[0]?.content?.parts?.[0]?.text
}

async function queryOpenAI(prompt) {
  if (!OPENAI_API_KEY) throw new Error('No OpenAI API key')
  const res = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150
  }, {
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
  })
  return res.data.choices[0].message.content
}

async function queryHuggingFace(prompt) {
  if (!HUGGINGFACE_API_KEY) throw new Error('No HuggingFace API key')
  const res = await axios.post('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
    inputs: prompt
  }, {
    headers: { 'Authorization': `Bearer ${HUGGINGFACE_API_KEY}` }
  })
  return res.data.generated_text || res.data[0]?.generated_text
}

function shouldReply(sender, text) {
  const contact = Object.values(CONTACTS).find(c => c.number === sender)
  if (contact) {
    return Math.random() < contact.replyChance
  }
  const greetings = ['hi', 'hello', 'hey', 'salam', 'assalam']
  const questions = ['?', 'kya', 'how', 'what', 'when', 'where', 'why']
  if (greetings.some(g => text.toLowerCase().includes(g))) return true
  if (questions.some(q => text.toLowerCase().includes(q))) return true
  return Math.random() < 0.6
}

function scheduleStatusUpdates(sock) {
  const statuses = [
    "Busy building the future 🚀",
    "In the zone 🎯",
    "Coffee + Code = ❤️",
    "Making magic happen ✨",
    "Unavailable but Wraith got you 👻"
  ]
  cron.schedule('0 */4 * * *', () => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    sock.updateProfileStatus(status)
    console.log(chalk.cyan(`📱 Status updated: ${status}`))
  })
}

function learnPersonality(sender, text) {
  if (!CONFIG.PERSONALITY_LEARNING) return
  if (!userPersonalities[sender]) {
    userPersonalities[sender] = {
      formality: 0.5,
      enthusiasm: 0.5,
      topics: []
    }
  }
  const profile = userPersonalities[sender]
  const formalWords = ['please', 'thank you', 'sir', 'madam', 'kindly']
  const casualWords = ['bro', 'dude', 'yaar', 'lol', 'bruh']
  if (formalWords.some(w => text.toLowerCase().includes(w))) profile.formality += 0.1
  if (casualWords.some(w => text.toLowerCase().includes(w))) profile.formality -= 0.1
  const exclamations = (text.match(/[!]/g) || []).length
  const emojis = (text.match(/[\u{1f600}-\u{1f64f}]|[\u{1f300}-\u{1f5ff}]|[\u{1f680}-\u{1f6ff}]|[\u{1f1e0}-\u{1f1ff}]/gu) || []).length
  if (exclamations > 0 || emojis > 0) profile.enthusiasm += 0.05
  profile.formality = Math.max(0, Math.min(1, profile.formality))
  profile.enthusiasm = Math.max(0, Math.min(1, profile.enthusiasm))
}

async function handleMedia(msg, sock) {
  try {
    if (msg.message.imageMessage) {
      console.log(chalk.magenta('📸 Image received - analyzing...'))
      return "Nice pic! 📸 Looking good!"
    }
    if (msg.message.audioMessage) {
      console.log(chalk.magenta('🎵 Voice message received'))
      return "Got your voice message! 🎵 I'll listen to it later"
    }
    if (msg.message.videoMessage) {
      console.log(chalk.magenta('🎥 Video received'))
      return "Cool video! 🎥 Thanks for sharing"
    }
    if (msg.message.documentMessage) {
      console.log(chalk.magenta('📄 Document received'))
      return "Thanks for the document! 📄 I'll check it out"
    }
    return null
  } catch (error) {
    console.error(chalk.red('❌ Media handling error:'), error)
    return "Received your media! 👍"
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    markOnlineOnConnect: false
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log(chalk.yellow('🔌 Connection closed'), lastDisconnect?.error, chalk.yellow('Reconnecting:'), shouldReconnect)
      if (shouldReconnect) {
        setTimeout(() => startBot(), 5000)
      }
    } else if (connection === 'open') {
      console.log(chalk.green('✅ Wraith is now haunting WhatsApp! 👻'))
      scheduleStatusUpdates(sock)
    }
  })
  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue
      const sender = msg.key.remoteJid
      const isGroup = sender.includes('@g.us')
      if (isGroup && !msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.includes(sock.user.id.replace(':0', ''))) {
        continue
      }
      const mediaResponse = await handleMedia(msg, sock)
      if (mediaResponse) {
        setTimeout(async () => {
          await sock.sendMessage(sender, { text: mediaResponse })
        }, calculateSmartDelay(mediaResponse, sender))
        continue
      }
      const text = msg.message.conversation || 
                   msg.message.extendedTextMessage?.text ||
                   msg.message.imageMessage?.caption ||
                   msg.message.videoMessage?.caption
      if (!text) continue
      if (isRateLimited(sender)) {
        console.log(chalk.red(`⏰ Rate limited: ${sender}`))
        continue
      }
      if (!shouldReply(sender, text)) {
        console.log(chalk.gray(`🤐 Ignoring message from ${sender}: ${text.substring(0, 50)}...`))
        continue
      }
      learnPersonality(sender, text)
      if (!userHistories[sender]) userHistories[sender] = []
      userHistories[sender].push({ from: 'user', text, timestamp: Date.now() })
      if (userHistories[sender].length > CONFIG.MESSAGE_HISTORY_LIMIT) {
        userHistories[sender] = userHistories[sender].slice(-CONFIG.MESSAGE_HISTORY_LIMIT)
      }
      console.log(chalk.yellow(`💬 ${sender}: ${text}`))
      let persona = 'default'
      const contact = Object.values(CONTACTS).find(c => c.number === sender)
      if (contact) {
        persona = contact.personality
      }
      const delay = calculateSmartDelay(text, sender)
      setTimeout(async () => {
        try {
          if (CONFIG.TYPING_SIMULATION) {
            await sock.sendPresenceUpdate('composing', sender)
          }
          const historyForContext = userHistories[sender].slice(0, -1)
          const reply = await askAI(text, historyForContext, persona, sender)
          userHistories[sender].push({ from: 'bot', text: reply, timestamp: Date.now() })
          if (userHistories[sender].length > CONFIG.MESSAGE_HISTORY_LIMIT) {
            userHistories[sender] = userHistories[sender].slice(-CONFIG.MESSAGE_HISTORY_LIMIT)
          }
          if (CONFIG.TYPING_SIMULATION) {
            await sock.sendPresenceUpdate('available', sender)
          }
          await sock.sendMessage(sender, { text: reply })
          console.log(chalk.green(`✅ Replied to ${sender}: ${reply.substring(0, 50)}...`))
        } catch (error) {
          console.error(chalk.red('❌ Error processing message:'), error)
          await sock.sendMessage(sender, { 
            text: "Something went wrong on my end! I'll get back to you soon 🔧" 
          })
        }
      }, delay)
    }
  })
}

process.on('SIGINT', () => {
  console.log(chalk.red('\n👻 Wraith is vanishing...'))
  process.exit(0)
})

setInterval(() => {
  if (Object.keys(userHistories).length > 0) {
    fs.writeFileSync('./user_histories.json', JSON.stringify(userHistories, null, 2))
    fs.writeFileSync('./user_personalities.json', JSON.stringify(userPersonalities, null, 2))
  }
}, 60000)

try {
  const savedHistories = fs.readFileSync('./user_histories.json', 'utf8')
  Object.assign(userHistories, JSON.parse(savedHistories))
  console.log(chalk.blue('📚 Loaded conversation histories'))
} catch (e) {
  console.log(chalk.yellow('📚 No previous histories found'))
}

try {
  const savedPersonalities = fs.readFileSync('./user_personalities.json', 'utf8')
  Object.assign(userPersonalities, JSON.parse(savedPersonalities))
  console.log(chalk.blue('🧠 Loaded personality profiles'))
} catch (e) {
  console.log(chalk.yellow('🧠 No previous personality data found'))
}

console.log(chalk.magenta(`
👻 WRAITH 2.0 INITIALIZING...
📱 Features loaded:
   ✅ Multi-AI fallback system
   ✅ Smart reply timing
   ✅ Personality learning
   ✅ Rate limiting
   ✅ Media handling
   ✅ Auto status updates
   ✅ Conversation context
   
🚀 Starting the ghost...
`))

startBot()
