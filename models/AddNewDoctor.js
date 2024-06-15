const mongoose = require("mongoose");
const AddNewDoctorSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    contact: { type: Number, required: true, trim: true },
    nic: { type: Number, required: true, trim: true },
    dob: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    doctorDepartment: { type: String, required: true, trim: true },
    // docAvatar: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);
const addNewDoctormodel = mongoose.model(
  "addnewdoctordatas",
  AddNewDoctorSchema
);
module.exports = addNewDoctormodel;
