# 🛒 NovaCart — Complete Ecommerce Website

**Smart Shopping, Better Living**

A full-featured ecommerce website built with React + Vite + Tailwind CSS + Supabase.

---

## ⚡ Quick Start (صرف 3 steps)

### Step 1 — Dependencies Install کریں
```bash
npm install
```

### Step 2 — Supabase Connect کریں (نیچے guide دیکھیں)

### Step 3 — Project چلائیں
```bash
npm run dev
```
Browser میں کھلے گا: **http://localhost:5173/novacart/**

---

## 🗄️ Supabase Setup (Database Connect کرنا)

> ⚠️ Supabase بغیر بھی app چلے گا — dummy data سے۔ لیکن login/signup اور orders save کرنے کے لیے Supabase ضروری ہے۔

### 1. Supabase Account بنائیں
- https://supabase.com پر جائیں
- "Start for Free" → GitHub سے sign up کریں

### 2. New Project بنائیں
- Dashboard میں "New Project" کلک کریں
- Name: `novacart`
- Password: کوئی بھی strong password
- Region: اپنے قریب والا choose کریں
- "Create new project" کلک کریں (2-3 منٹ لگیں گے)

### 3. Database Schema چلائیں
- Supabase Dashboard میں بائیں طرف **SQL Editor** کلک کریں
- "New Query" کلک کریں
- `supabase_schema.sql` فائل کھولیں (project folder میں ہے)
- سارا content copy کریں اور SQL Editor میں paste کریں
- **"Run"** کلک کریں ✅

### 4. API Keys لیں
- بائیں طرف **Settings** → **API** کلک کریں
- یہ دو چیزیں copy کریں:
  - **Project URL** (جیسے: `https://abcdef.supabase.co`)
  - **anon/public key** (لمبی string)

### 5. .env.local بنائیں
Project folder میں `.env.example` file کا duplicate بنائیں، نام رکھیں `.env.local`:
```
VITE_SUPABASE_URL=https://آپ-کی-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=آپ-کی-anon-key
```

### 6. Project دوبارہ چلائیں
```bash
npm run dev
```

---

## 📁 Project Structure

```
novacart/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── products.js          ← Supabase API calls
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductGrid.jsx
│   │   └── ui/
│   │       └── StarRating.jsx
│   ├── context/
│   │   ├── AuthContext.jsx      ← Login/logout state
│   │   └── CartContext.jsx      ← Cart state
│   ├── lib/
│   │   ├── supabase.js          ← Supabase client
│   │   ├── dummyData.js         ← سارا dummy data یہاں ہے
│   │   └── utils.js             ← Helper functions
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ShopPage.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── AccountPage.jsx
│   │   ├── OrderConfirmationPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── supabase_schema.sql          ← Database tables
├── .env.example                 ← Keys کا template
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🖼️ Dummy Data تبدیل کرنا

تمام dummy products اور categories یہاں ہیں:
```
src/lib/dummyData.js
```

**Product image تبدیل کرنا:**
```js
image: 'https://آپ-کی-image-url.jpg',
```

**Product price تبدیل کرنا:**
```js
price: 299.99,
discount_price: 199.99,  // null کریں اگر discount نہیں
```

---

## 🚀 GitHub Pages پر Deploy کرنا

### 1. GitHub Repository بنائیں
- https://github.com پر جائیں
- "New Repository" → نام: `novacart`
- Public رکھیں → "Create repository"

### 2. vite.config.js میں repo name ڈالیں
```js
base: '/novacart/',  // آپ کے repo کا نام
```

### 3. Deploy کریں
```bash
npm run build
npm run deploy
```

### 4. GitHub Settings
- Repository → **Settings** → **Pages**
- Source: `gh-pages` branch → Save
- چند منٹ بعد آپ کی site live ہوگی! 🎉

---

## 🛠️ Available Commands

| Command | کام |
|---------|-----|
| `npm run dev` | Local development server |
| `npm run build` | Production build بنائیں |
| `npm run preview` | Build preview دیکھیں |
| `npm run deploy` | GitHub Pages پر deploy کریں |

---

## ✏️ Customize کرنا

| چیز | فائل |
|-----|------|
| Store name | `index.html` + `Navbar.jsx` |
| Colors | `tailwind.config.js` |
| Products | `src/lib/dummyData.js` |
| Homepage text | `src/pages/HomePage.jsx` |
| Footer links | `src/components/layout/Footer.jsx` |

---

**Built with ❤️ using React + Vite + Tailwind CSS + Supabase**
