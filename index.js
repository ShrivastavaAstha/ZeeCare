const express = require("express");
const app = express();
app.use(express.json());
const cookies = require("cookie-parser");
app.use(cookies());
const { connectDatabase } = require("./connection/connect");
const registermodel = require("./models/Register");
const addNewDoctormodel = require("./models/AddNewDoctor");
const addNewAdminmodel = require("./models/AddNewAdmin");
const newmessagemodel = require("./models/Message");
const addAppointmentmodel = require("./models/Appointment");
const verifyToken = require("./tokens/verifyToken");
const generateToken = require("./tokens/generateToken");
const { encryptPassword, verifyPassword } = require("./functions/encryption");
const path = require("path");

//Registerapi----------------------------------------------------------
app.post("/api/registerapi", async (req, res) => {
  try {
    const { email } = req.body.email;
    const UserEmailExist = await registermodel.findOne({ email });
    if (UserEmailExist) {
      return res.json({ message: "Email Already Exists." });
    }
    const obj = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      contact: req.body.contact,
      nic: req.body.nic,
      dob: req.body.dob,
      gender: req.body.gender,
      password: await encryptPassword(req.body.password),
    };
    console.log(obj);
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
      const registerdata = new registermodel(obj);
      await registerdata.save();
      return res.status(200).json({ success: true, message: "Data Saved." });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Invalid Email." });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
//---------------------------------------------------------------------
//loginapi-------------------------------------------------------------
app.post("/api/loginapi", async (req, res) => {
  try {
    let email = req.body.email;
    let inputpassword = req.body.password;
    const checkuser = await registermodel.findOne({
      email: email,
    });
    if (!checkuser) {
      return res
        .status(400)
        .json({ success: false, error: "User not found,please signup first" });
    }
    let originalpassword = checkuser.password;
    if (await verifyPassword(inputpassword, originalpassword)) {
      const token = generateToken(checkuser._id);
      res.cookie("auth_tk", token);
      console.log(token);
      return res.json({ success: true, message: "Logged in Successfully!" });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
});
//---------------------------------------------------------------------
// middleware---------------------------------------------------------------------
const checkIfUserLogin = (req, res, next) => {
  if (verifyToken(req.cookies.auth_tk)) {
    const userinfo = verifyToken(req.cookies.auth_tk);
    req.userid = userinfo.id;
    next();
  } else {
    return res.status(400).json({ success: false, error: "UNAUTHORIZED" });
  }
};
// ---------------------------------------------------------------------
// ----------------------------------------------------------------------
app.post("/api/addnewdoctor", checkIfUserLogin, async (req, res) => {
  try {
    const doctordata = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      contact: req.body.contact,
      nic: req.body.nic,
      dob: req.body.dob,
      gender: req.body.gender,
      password: req.body.password,
      doctorDepartment: req.body.doctorDepartment,
      docAvatar: req.body.docAvatar,
    };
    console.log(doctordata);
    const newdoctordata = new addNewDoctormodel(doctordata);
    await newdoctordata.save();
    return res.status(200).json({ success: true, message: "Doctor Added" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});
// ----------------------------------------------------------------------
//-----------------------------------------------------------------------
app.post("/api/addnewadmin", checkIfUserLogin, async (req, res) => {
  try {
    const admindata = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      contact: req.body.contact,
      nic: req.body.nic,
      dob: req.body.dob,
      gender: req.body.gender,
      password: req.body.password,
    };
    console.log(admindata);
    const newadmindata = new addNewAdminmodel(admindata);
    await newadmindata.save();
    return res.status(200).json({ success: true, message: "New Admin Added" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
app.get("/api/addnewdoctor", checkIfUserLogin, async (req, res) => {
  try {
    const doctors = await addNewDoctormodel.find();
    return res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------------
//-----------------------------------------------------------------------
app.post("/api/addmessage", checkIfUserLogin, async (req, res) => {
  try {
    const messagedata = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      contact: req.body.contact,
      message: req.body.message,
    };
    console.log(messagedata);
    const newmessagedata = new newmessagemodel(messagedata);
    await newmessagedata.save();
    return res.status(200).json({ success: true, message: "Message Sent" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});
//-----------------------------------------------------------------------
// ----------------------------------------------------------------------
app.get("/api/addmessage", checkIfUserLogin, async (req, res) => {
  try {
    const messages = await newmessagemodel.find();
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
//deletemsg----------------------------------------------------
app.delete("/api/deletemsg/:id", checkIfUserLogin, async (req, res) => {
  try {
    await newmessagemodel.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});
// ---------------------------------------------------------------------
//-----------------------------------------------------------------------
app.post("/api/addappointment", checkIfUserLogin, async (req, res) => {
  try {
    const appointmentdata = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      contact: req.body.contact,
      nic: req.body.nic,
      dob: req.body.dob,
      gender: req.body.gender,
      appointmentDate: req.body.appointmentDate,
      department: req.body.department,
      doctorFirstname: req.body.doctorFirstname,
      doctorLastname: req.body.doctorLastname,
      address: req.body.address,
      hasVisited: req.body.hasVisited,
    };
    console.log(appointmentdata);
    const newappointmentdata = new addAppointmentmodel(appointmentdata);
    await newappointmentdata.save();
    return res
      .status(200)
      .json({ success: true, message: "Appointment Done." });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
app.get("/api/addappointment", checkIfUserLogin, async (req, res) => {
  try {
    const appointment = await addAppointmentmodel.find();
    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
app.post(
  "/api/handleappointmentstatus/:id",
  checkIfUserLogin,
  async (req, res) => {
    try {
      const data = await addAppointmentmodel.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
      });
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
);
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

app.get("/currentuser", checkIfUserLogin, async (req, res) => {
  try {
    const userid = req.userid;
    const userdetails = await registermodel.findOne({ _id: userid });
    if (userdetails) {
      return res.json({ success: true, data: userdetails });
    } else {
      return res.status(400).json({ success: false, error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
app.get("/api/logout", (req, res) => {
  try {
    res.clearCookie("auth_tk");
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});
// ----------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
connectDatabase();

app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname + "/client/build/index.html"),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
});

app.listen(PORT, async () => {
  await console.log(`Server is running at ${PORT}`);
});
