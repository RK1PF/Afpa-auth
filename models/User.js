require('dotenv').config();

const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
// Mongoose params
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    active: Boolean
  },
  { collection: "users" }
);
const secretPass = process.env.SECRETPASS;

userSchema.plugin(encrypt, {secret: secretPass, encryptedFields: ['password'] });

module.exports = mongoose.model("User", userSchema);
