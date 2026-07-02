const mongoose = require('mongoose');

// ---------------------------------------------
// USER MODEL
// Covers both OrgAdmin and EndUser roles. Super Admin is NOT stored here —
// it uses static credentials from .env, since it's a single system-level
// account rather than a tenant-scoped user.
// ---------------------------------------------
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true // stored as a bcrypt hash, never plaintext
    },
    role: {
      type: String,
      enum: ['OrgAdmin', 'EndUser'],
      required: true
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    }
  },
  { timestamps: true }
);

// Prevents the same email from being used twice within the same org
// (email is already globally unique above, but this also guards against
// duplicate-key edge cases if that constraint is ever relaxed later)
userSchema.index({ orgId: 1, email: 1 });

module.exports = mongoose.model('User', userSchema);