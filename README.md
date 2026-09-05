[README (1).md](https://github.com/user-attachments/files/28548128/README.1.md)# TeacherRating 🎓

A professor rating and review platform built for TSU (Tbilisi State University) students.

---

## 📖 About

TeacherRating allows Tbilisi State University students to anonymously review and rate their professors, and read reviews left by other students. The goal is to provide a transparent and reliable resource to help students make better course decisions.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** — with App Router
- **TypeScript**
- **Tailwind CSS v4**

### Backend / Database
- **SQL Server** (SSMS)
- Database name: `rate_my_teacher`

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `Faculties` | University faculties |
| `Departments` | Departments within faculties |
| `Professors` | Professors (linked to departments via N:M junction table) |
| `Students` | Students (subtypes: UNDERGRADUATE / MASTER / PHD) |
| `Reviews` | Student reviews |
| `ReviewCategories` | Rating categories |
| `ReviewRatings` | Per-category scores |
| `ReviewInteractions` | Upvotes / downvotes on reviews |
| `ReviewTags` | Review-to-tag relations |
| `Tags` | Tags |
| `ProfessorTags` | Professor-to-tag relations |
| `UserVerifications` | Student verification |

---

## 📁 Project Structure

```
teacher-rating/
├── app/
│   ├── (auth)/
│   ├── (main)/
│   └── layout.tsx
├── components/
├── lib/
│   ├── types/
│   │   ├── professor.ts
│   │   ├── review.ts
│   │   └── user.ts
│   ├── utils/
│   ├── constants/
│   └── mock-data/
├── public/
└── README.md
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

App runs at `http://localhost:3000`.

---

## ✨ Features

- 🔍 Search by professor or department
- ⭐ Multi-category rating system
- 💬 Anonymous reviews
- 👍 Review voting (upvote / downvote)
- 🏷️ Tag system
- 🎓 Filter by student type (Undergraduate / Master / PhD)
- 📱 Responsive design

---

## 📌 Notes

- Currently scoped to a **single university** (TSU).
- All code and variable naming follows **English** conventions.
- Uses **"Review"** terminology instead of "Comment."

---

## 👨‍💻 Developer

Sabir — Computer Science, Tbilisi State University








This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open ([http://localhost:3000](https://tsuratingteacher.vercel.app)) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
