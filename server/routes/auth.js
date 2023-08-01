import express from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

import authMiddleware from './users.js';

dotenv.config()

const router = express.Router();

function validatePassword(user, password) {
  return bcrypt.compare(password, user.password);
}


// register route
router.post('/', async (req, res) => {
  const { name, email, username, password } = req.body;

  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    return res.status(400).json({ error: 'Email address already in use' });
  }

  const existingUserByUsername = await User.findOne({ username });
  if (existingUserByUsername) {
    return res.status(400).json({ error: 'Username already in use' });
  }

  const existingUserByNameAndEmail = await User.findOne({ name, email });
  if (existingUserByNameAndEmail) {
    return res.status(400).json({ error: 'User with this name and email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, username, password: hashedPassword });
  const token = jwt.sign({ email: email }, 'forsenbruh')
  user.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save user' });
    } else {
      res.json({ message: 'User created', user, token: token });
    }
  });
});

// login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const isValidPassword = await validatePassword(user, password);
  const token = jwt.sign({ email: email }, 'forsenbruh')
  if (!isValidPassword) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  res.json({ message: 'Login successful', user, token: token });
});


export default router;
