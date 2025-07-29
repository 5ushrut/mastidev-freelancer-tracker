# mastidev-freelancer-tracker
A clean, minimal React Native app to manage freelance clients, invoices, payments, and time logs.

# 🧾 Freelancer Project & Payment Tracker App

[![Made with React Native](https://img.shields.io/badge/React%20Native-v0.74+-informational?style=flat-square&logo=react)](https://reactnative.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Status](https://img.shields.io/badge/status-in%20development-orange)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-green)

Track your freelance projects, invoices, time logs, and payments — all in one beautifully minimal and cohesive mobile app. Built for developers, designers, writers, and solopreneurs.

---

## 🧩 Features

- 🧑‍💼 **Clients Management**
  - Add, edit, and view all clients
- 📝 **Invoices**
  - Generate, export, and track payment status
- ⏱️ **Time Logging**
  - Per project timer with log history
- 💼 **Projects**
  - Organize tasks, associate clients, and track progress
- 📊 **Analytics**
  - Track income, outstanding payments, and time
- ⚙️ **Settings Panel**
  - Fully customizable app behavior and default templates
- 🌙 **Dark / Light Theme** with smooth transitions
- 🧠 Built with psychological UX strategies to improve habit formation and retention

---

## 📱 Preview

> _Add a `screenshots/` folder or `preview.gif` here for visual impact_

![Preview](screenshots/app_preview.png)

---

## 🛠 Tech Stack

| Layer            | Tech                              |
|------------------|-----------------------------------|
| Mobile App       | React Native (Expo / Bare)        |
| State Management | Context API / Redux (your choice) |
| UI Components    | Custom + Tailwind-like utility styling (or NativeBase / Paper) |
| Data Storage     | AsyncStorage / SQLite / Supabase (modular backend) |
| Date Handling    | `dayjs` / `date-fns`              |
| Animations       | `react-native-reanimated`, Lottie |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Yarn / npm
- Expo CLI or React Native CLI

### Installation

```bash
git clone https://github.com/sushrut-satpute/freelancer-tracker-app.git
cd freelancer-tracker-app
yarn install
# or npm install
Run the app
yarn android   # for Android
yarn ios       # for iOS (macOS only)

🧪 Roadmap
 Multi-currency support

 Export invoices as PDF

 Stripe / Razorpay integration

 Project deadlines & reminders

 Cloud sync (Firebase / Supabase)

 Email clients directly from app

 Web version

📂 Project Structure
bash
Copy
Edit
freelancer-tracker-app/
│
├── assets/                 # Images, icons, Lottie files
├── components/             # Reusable UI elements
├── screens/                # Screens (Invoice, Project, Settings...)
├── context/                # Global state (Auth, Settings)
├── data/                   # Dummy data, schemas
├── utils/                  # Helpers, date formatters
├── navigation/             # Tab & stack navigators
├── App.tsx                 # Entry point
└── ...
🤝 Contributing
Fork the repo

Create your feature branch (git checkout -b feature/something)

Commit your changes (git commit -m 'Add something')

Push to the branch (git push origin feature/something)

Open a PR

See CONTRIBUTING.md for detailed steps.

📜 License
This project is licensed under the MIT License.

💌 Author
Built with love by Sushrut Tushar Satpute
🔗 LinkedIn
🐙 GitHub

🌟 Star this repo
If you found this useful, consider giving it a ⭐ to support the project and help more freelancers discover it!

yaml
Copy
Edit

---
