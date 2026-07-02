const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Organization = require('../models/organizationModel');

// Helper to sign tokens consistently across all auth flows
const signToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });
};

// ---------------------------------------------
// SUPER ADMIN LOGIN
// Static credentials from .env — no DB record exists for Super Admin
// ---------------------------------------------
exports.superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (
      email !== process.env.SUPERADMIN_EMAIL ||
      password !== process.env.SUPERADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ role: 'SuperAdmin' });

    res.status(200).json({
      message: 'Super Admin logged in successfully',
      token,
      role: 'SuperAdmin'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------
// ORG ADMIN SIGNUP
// Requires an existing orgId (created earlier by Super Admin)
// ---------------------------------------------
exports.orgAdminSignup = async (req, res) => {
  try {
    const { username, email, password, orgId } = req.body;

    if (!username || !email || !password || !orgId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const orgExists = await Organization.findById(orgId);
    if (!orgExists) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'OrgAdmin',
      orgId
    });

    const token = signToken({
      userId: newUser._id,
      orgId: newUser.orgId,
      role: newUser.role
    });

    res.status(201).json({
      message: 'Org Admin registered successfully',
      token,
      role: newUser.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------
// END USER SIGNUP
// Requires an existing orgId
// ---------------------------------------------
exports.endUserSignup = async (req, res) => {
  try {
    const { username, email, password, orgId } = req.body;

    if (!username || !email || !password || !orgId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const orgExists = await Organization.findById(orgId);
    if (!orgExists) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'EndUser',
      orgId
    });

    const token = signToken({
      userId: newUser._id,
      orgId: newUser.orgId,
      role: newUser.role
    });

    res.status(201).json({
      message: 'End User registered successfully',
      token,
      role: newUser.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------
// SHARED LOGIN — used by both OrgAdmin and EndUser
// Role is read from the DB record, never trusted from request body
// ---------------------------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({
      userId: user._id,
      orgId: user.orgId,
      role: user.role
    });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      role: user.role,
      orgId: user.orgId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
