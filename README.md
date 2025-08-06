# Wraith

Wraith is a message automation and personality emulation system for WhatsApp. It runs on Node.js and maintains a persistent WhatsApp Web session to handle real-time user interactions. The system is capable of contextually responding to user inputs in casual language while maintaining a consistent persona.

## Key Features

- Full-duplex real-time message handling
- Emulates a specific user identity with personalized responses
- Integrates seamlessly with WhatsApp using reverse-engineered web socket protocol
- Supports persistent session state across reboots using multi-file credentials
- Includes custom message parsing and processing pipeline
- Terminal-based QR login flow
- Compatible with major operating systems (Windows macOS Linux)

## System Behavior

- On receiving a message the system extracts textual content
- Input is processed through a structured response generator configured with dynamic context
- A natural-sounding reply is formulated based on prior conversational tone and user identity
- The response is sent back to the originating user via WhatsApp socket

## Installation

```bash
git clone https://github.com/saadhtiwana/wraith
cd wraith
npm install
