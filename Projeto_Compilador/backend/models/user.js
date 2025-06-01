const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  level: { type: String, enum: ['admin', 'client'], default: 'client' },
  createdAt: Date,
  active: Boolean,
  following: [{ type: String, ref: 'User' }],
  followers: [{ type: String, ref: 'User' }],
  shared: [{ type: Number, ref: 'Item' }],
  numPosts: { type: Number, default: 0 }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);