const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    contact: { type: Number, required: true, trim: true },
    nic: { type: Number, required: true, trim: true },
    dob: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    appointmentDate: { type: String, trim: true },
    department: { type: String, required: true, trim: true },
    // doctorFirstname: { type: String, trim: true },
    // doctorLastname: { type: String, trim: true },
    doctorId: { type: String, trim: true },
    address: { type: String, trim: true },
    hasVisited: { type: Boolean, trim: true },
    status: { type: String, enum: ["Accepted", "Pending", "Rejected"] },
  },
  { timestamps: true }
);
const appointmentmodel = mongoose.model("Appointmentdatas", AppointmentSchema);
module.exports = appointmentmodel;
