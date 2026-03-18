# CRM Pro — Sales CRM Dashboard

A production-ready CRM built with the MERN stack. Manage leads, track tasks, and visualize your sales pipeline — all in one place.

🔗 **Live Demo:** [crm-dashboard-six.vercel.app](https://crm-dashboard-six.vercel.app)

---

## What it does

- 🔐 **Secure auth** — JWT stored in httpOnly cookies, role-based access (Admin / Manager / Agent)
- 👥 **Leads management** — Add, edit, search, filter and paginate leads. All filtering happens server-side in MongoDB.
- ✅ **Task system** — Create tasks with priorities, due dates, and lead links. Overdue tasks highlighted automatically.
- 📊 **Live dashboard** — Stats cards and charts powered by MongoDB aggregation pipelines.
- 📝 **Notes timeline** — Log notes against any lead with author and timestamp.
- 🔔 **Browser reminders** — Get notified when a task is due within 24 hours.
- 🌙 **Dark / Light mode** — Theme persists across sessions.

---

## Built with

|             |                                        |
| ----------- | -------------------------------------- |
| Frontend    | React 18, Vite, React Router, Recharts |
| Backend     | Node.js, Express.js                    |
| Database    | MongoDB Atlas, Mongoose                |
| Auth        | JWT, bcryptjs, httpOnly cookies        |
| Deployed on | Vercel + Render                        |

---

## Run it locally

```bash
# 1. Clone the repo
git clone https://github.com/Yashrathor2002/crm-dashboard.git
cd crm-dashboard

# 2. Start the backend
cd server
npm install
# Add your .env file (see below)
npm run dev

# 3. Start the frontend
cd ../client
npm install
npm run dev
```

**Server `.env`**

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Client `.env`**

```
VITE_API_URL=http://localhost:5000/api
```

---

## Why this project stands out

Most MERN projects stop at basic CRUD. This one goes further —
server-side filtering, JWT in httpOnly cookies, MongoDB aggregation for analytics,
browser notifications, and a fully responsive dark/light UI.
Every decision was made the way a real product would be built.

---

> Built by [Yash Rathor](https://github.com/Yashrathor2002) · Open to frontend / full-stack roles
