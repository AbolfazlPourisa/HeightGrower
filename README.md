# 📏 HeightGrower

> 🌱 A Telegram bot for growing your height through fun betting games!

---

## ✨ Features

- 👤 User management with database storage
- 🎲 Create and manage bets between users
- 📊 Track user growth and statistics
- 🔒 Secure PostgreSQL database integration
- 🚀 Built with TypeScript for type safety

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** pg (node-postgres)
- **Bot Framework:** Telegraf (Telegram Bot API)

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))

---

## 🚀 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/AbolfazlPourisa/HeightGrower.git
cd HeightGrower
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables
- Create a .env file in the root directory
.env```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=heightgrower
DB_USER=your_username
DB_PASSWORD=your_password

BOT_TOKEN=your_telegram_bot_token

LOG_LEVEL=2  # 0=NONE, 1=ERROR, 2=INFO
```
## Usage
bash```
npm start
```