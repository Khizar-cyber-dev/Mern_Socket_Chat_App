import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRoutes from './route/authRoute.js';
import passport from './lib/passport.js';
import cookieParser from 'cookie-parser';
import session from 'express-session'; 
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

if (process.env.NODE_ENV === "production") {
  const distDir = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(distDir));
  console.log("Serving static files from:", distDir);

  app.use((req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
