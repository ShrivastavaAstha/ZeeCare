const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    contact: { type: Number, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
const messagemodel = mongoose.model("messagedatas", MessageSchema);
module.exports = messagemodel;
