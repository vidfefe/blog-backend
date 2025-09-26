# 🛠 Blog Backend

## 📖 Description
Backend service for the blog application. It provides user authentication and authorization, post management, file uploads, and security middleware. The project demonstrates building a REST API with Express, TypeScript, and MongoDB, using modern practices for validation and security.

## 🛠 Technologies Used
- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** (used for handling file uploads, now integrated with **Cloudinary**)
- **Cloudinary** for file storage
- **Zod** + **express-validator** for validation
- **Helmet**, **CORS**, **compression**, **morgan**, **express-rate-limit** for security and performance
- **dotenv** for environment variables
- **Nodemon** / **TSX** for development

## ⚙️ How to Run

```bash
# 1. Clone the repository
git clone https://github.com/vidfefe/blog-backend.git
cd blog-backend

# 2. Install dependencies
npm install

# 3. Create a .env file based on .env.example and fill in your values
cp .env.example .env
# Then open .env and add your own values

# 4. Start the development server
npm run start:dev
```

[Demo Vibe Blog](https://blog-frontend-lake-ten.vercel.app/)
