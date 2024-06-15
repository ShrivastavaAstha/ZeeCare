const mongoose = require("mongoose");
const RegisterSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    contact: { type: Number, required: true, trim: true },
    nic: { type: Number, required: true, trim: true },
    dob: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
const registermodel = mongoose.model("registerdatas", RegisterSchema);
module.exports = registermodel;
