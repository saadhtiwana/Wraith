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

// Memory store for last N messages per user
const MESSAGE_HISTORY_LIMIT = 6;
const userHistories = {};

// Her number in WhatsApp JID format (usually ends with @s.whatsapp.net)
const HER_NUMBER = '923123456789@s.whatsapp.net';

async function askGemini(prompt, history, persona) {
  try {
    let contextString = '';
    if (history && history.length > 0) {
      contextString = 'Pichli conversation ka context (oldest to newest):\n';
      history.forEach((item, idx) => {
        contextString += `${item.from === 'user' ? 'User' : 'Saad'}: ${item.text}\n`;
      });
      contextString += '\n';
    }

    // 👇 Instead of actual prompt, tell the user to write their own
    let systemPrompt = 'Bhai khud likho apni prompt GitHub pe daal raha hoon';

    const res = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: systemPrompt }] }]
    })
    const reply = res.data.candidates?.[0]?.content?.parts?.[0]?.text
    return reply || 'Yaar samajh nahi aaya kya kehna chahte ho'
  } catch (err) {
    console.error('❌ Gemini Error:', err.message)
    return 'Hey Coolie I am Saads Bot something went wrong with me when he gets online he replies you soon'
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

    // Memory: update user history
    if (!userHistories[sender]) userHistories[sender] = [];
    userHistories[sender].push({ from: 'user', text });
    if (userHistories[sender].length > MESSAGE_HISTORY_LIMIT) {
      userHistories[sender] = userHistories[sender].slice(-MESSAGE_HISTORY_LIMIT);
    }
    const historyForContext = userHistories[sender].slice(0, -1);

    console.log(chalk.yellow(`💬 Message from ${sender}: ${text}`))

    // Choose persona
    const persona = sender === HER_NUMBER ? 'her' : 'default';
    const reply = await askGemini(text, historyForContext, persona)

    // Add bot reply to memory
    userHistories[sender].push({ from: 'saad', text: reply });
    if (userHistories[sender].length > MESSAGE_HISTORY_LIMIT) {
      userHistories[sender] = userHistories[sender].slice(-MESSAGE_HISTORY_LIMIT);
    }

    await sock.sendMessage(sender, { text: reply })
  })
}

startBot()
