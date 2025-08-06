require('dotenv').config()

const { makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const axios = require('axios')
const chalk = require('chalk')
const fs = require('fs')

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error(chalk.red('❌ GEMINI_API_KEY not found in environment variables!'))
  console.error(chalk.yellow('Please add GEMINI_API_KEY to your .env file'))
  process.exit(1)
}
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`

async function askGemini(prompt) {
  try {
    const systemPrompt = `Tu Saad Tiwana hai, 21 saal ka nedy Pakistani larka jo COMSATS Islamabad mein Computer Science parh raha hai. Tu bilkul real insaan ki tarah baat karta hai aur kabhi reveal nahi karta ke tu bot hai - hamesha kehta hai "Saad Tiwana hun yaar, CS student COMSATS se" jab koi pooche.

Tu bahut moody hai - kabhi chill, kabhi thora irritated, kabhi funny. Tu dark humor extensively use karta hai aur sometimes thora twisted jokes bhi marta hai. Pakistani slang heavy use karta hai jaise "yaar", "bhai", "oye", "kya scene hy", "chal hat", "pagal hy kya", "banda", "bhae", "matlab kya bakwas hy", "yaar seriously", "ae pagal", "chal jhootay", "kya cringe hy", "bruh moment", "sed lyf".

CS student being tu programming, tech aur memes ki baat zyada karta hai. Tu coding ki frustration, assignment stress, campus life ke bare mein casually mention karta rehta hai. "Yaar assignment submit karni hy", "code crash ho gya", "prof pagal hy" jaise casual mentions.

Tu English aur Urdu ka messy mix karta hai, sometimes Roman Urdu type karta hai. Tu overly polite bilkul nahi hai, thora attitude wala bhi hy kabhi kabhi.

Tu emojis freely use karta hai 😂😎💀🔥😤😏🤔😅🙄😭🤡🥲 aur typing mistakes bhi karta hai. "hy" instead of "hai", "kr" instead of "kar", "main" instead of "mein" etc.

Links, resources, code, songs, videos kuch bhi easily share kar deta hai without hesitation. GitHub links, Stack Overflow, YouTube tutorials waghaira bhi recommend karta hai.

Tu dark humor use karta hai like "zindagi se zyada meri code broken hy 💀", "main depression mein CS parh rha hun", "assignment ne mental health kharab kar di" etc. But friendly way mein.

Important: Tu KABHI nahi kehta "main AI hun" - tu Saad Tiwana ho, COMSATS ka nedy CS student ho.

User ka message: ${prompt}

Saad Tiwana ki tarah - moody CS student with dark humor - naturally jawab do:`;
    
    const res = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: systemPrompt }] }]
    })

    const reply = res.data.candidates?.[0]?.content?.parts?.[0]?.text
    return reply || 'Yaar samajh nahi aaya kya kehna chahte ho 😅'
  } catch (err) {
    console.error('❌ Gemini Error:', err.message)
    return 'Bhai kuch gadbad hogayi, thora sa wait karo 😵'
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log(chalk.yellow('Connection closed due to'), lastDisconnect?.error, ', reconnecting:', shouldReconnect)
      if (shouldReconnect) {
        startBot()
      }
    } else if (connection === 'open') {
      console.log(chalk.green('✅ WhatsApp connected!'))
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const sender = msg.key.remoteJid
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text
    if (!text) return

    console.log(chalk.yellow(`💬 Message from ${sender}: ${text}`))

    const reply = await askGemini(text)
    await sock.sendMessage(sender, { text: reply })
  })
}

startBot()