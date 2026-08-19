# Gramin Udyam Sathi (ग्रामीण उद्यम साथी)

> **Tagline:** "Maharashtra ke Gramin Udyamiyon ke liye Sarkari Yojanaon ki Sahi Jankari, Sahi Bhasha mein."

Gramin Udyam Sathi is a production-quality, responsive, mobile-first full-stack web application designed for rural entrepreneurs and small business owners in Maharashtra. It provides a centralized, simple, and multilingual way to discover, evaluate, and apply for government schemes tailored to their business type, district, and specific financial requirements.

---

## 🌟 Key Features

1. **Multilingual Interface (मराठी | हिंदी | English)**:
   - Zero-latency language switching.
   - Government schemes explained in 4 plain-language sections: **Eligibility**, **Benefits & Subsidies**, **Required Documents**, and **Application Process**.

2. **Transparent 100-Point Recommendation Engine**:
   - **Business Category Match**: +30 Points
   - **Requirement Match (Loan/Subsidy/Equipment/Training)**: +25 Points
   - **Location Match (36 Maharashtra Districts)**: +15 Points
   - **Entrepreneur Profile Match (Women/Youth/SHG/FPO/SC/ST)**: +15 Points
   - **Business Growth Stage Match**: +10 Points
   - **Basic Residence Verification**: +5 Points
   - Interactive breakdown modal explaining **"Why was this recommended?"**

3. **Maharashtra 36 Districts Hub**:
   - Dedicated district explorer for Pune, Nashik, Chhatrapati Sambhajinagar, Ahilyanagar, Nagpur, Kolhapur, etc.
   - Direct District Industries Centre (DIC) addresses and helpline phone contacts.

4. **Gramin Udyam AI Sahayak (Context-Aware Chatbot)**:
   - Answers queries in Marathi, Hindi, and English based on verified Neon PostgreSQL database records.

5. **Interactive Document Checklist & Eligibility Simulator**:
   - Track needed vs available documents (Aadhaar, Udyam, Project Report, 7/12 Extract, Bank Passbook).

6. **Full-Featured Protected Admin Portal**:
   - Live analytics (Total schemes, searches, most viewed scheme, category distribution).
   - Full CRUD management for government schemes with multilingual field inputs (Marathi, Hindi, English).

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Next.js RESTful API Routes (`/api/schemes`, `/api/recommendations`, `/api/districts`, `/api/chat`, `/api/auth`, `/api/admin/analytics`).
- **Database**: Neon PostgreSQL Database (`postgresql://neondb_owner:npg_0slBMXQ8yWiz@ep-shiny-block-ayycvznp-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`).
- **ORM & Seeding**: Prisma v5.21.1 with relational schema.
- **Authentication**: JWT & Session Cookies for Users and Admins.

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
- Node.js v18+ or v22+
- npm v10+

### 2. Clone & Install Dependencies
```bash
cd "Gramin Udyam Sathi"
npm install
```

### 3. Environment Configuration (`.env`)
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://neondb_owner:npg_0slBMXQ8yWiz@ep-shiny-block-ayycvznp-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="gramin-udyam-sathi-secret-key-2026-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Push Schema & Seed Database
```bash
# Push Prisma relational schema to Neon PostgreSQL
npx prisma db push

# Seed categories, 36 Maharashtra districts, authentic schemes & admin user
npx prisma db seed
```

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Login Credentials

- **Admin Login Page**: `http://localhost:3000/admin/login`
- **Email**: `admin@graminudyam.in`
- **Password**: `Admin@12345`

---

## 📱 Mobile Responsiveness & Accessibility

- Optimized for low-end Android smartphones.
- Mobile drawer navigation & sticky bottom filter modals.
- Large touchable buttons, high-contrast text, and simple typography.

---

## 📄 License & Disclaimer

This project is created for educational and college demonstration purposes. Scheme eligibility and official applications must be verified through official government portals.
