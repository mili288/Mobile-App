import cors from 'cors';
import express from 'express';
import bcrypt from 'bcrypt';

const app = express();

app.use(cors()); // Enable CORS
app.use(express.json());

// Middleware to add the Access-Control-Allow-Origin header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

export default app;
