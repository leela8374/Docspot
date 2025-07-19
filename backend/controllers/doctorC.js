const docSchema = require("../schemas/docModel");
const appointmentSchema = require("../schemas/appointmentModel");
const userSchema = require("../schemas/userModel");
const fs = require("fs");
const path = require('path');

const updateDoctorProfileController = async (req, res) => {
  console.log(req.body);
  try {
    const doctor = await docSchema.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    await doctor.save();
    return res.status(200).send({
      success: true,
      data: doctor,
      message: "successfully updated profile",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const getAllDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await docSchema.findOne({ userId: req.body.userId });

    const allApointments = await appointmentSchema.find({
      doctorId: doctor._id,
    });

    return res.status(200).send({
      message: "All the appointments are listed below.",
      success: true,
      data: allApointments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const handleStatusController = async (req, res) => {
  try {
    const { userid, appointmentId, status } = req.body;

    // Make sure to add a query condition to find the specific appointment
    const appointment = await appointmentSchema.findOneAndUpdate(
      { _id: appointmentId }, // Use _id to uniquely identify the appointment
      { status: status }, // Update the status field
      { new: true } // Set { new: true } to get the updated document as a result
    );

    const user = await userSchema.findOne({ _id: userid });

    const notification = user.notification;

    notification.push({
      type: "status-updated",
      message: `your appointment get ${status}`,
    });

    await user.save();
    await appointment.save();

    return res.status(200).send({
      success: true,
      message: "successfully updated",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false });
  }
};

const documentDownloadController = async (req, res) => {
  const filename = req.params.filename;
  if (!filename) {
    return res.status(400).send({ message: "Filename is required", success: false });
  }
  const absoluteFilePath = path.join(__dirname, "..", "uploads", filename);

  fs.access(absoluteFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send({ message: "File not found", success: false });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    const fileStream = fs.createReadStream(absoluteFilePath);
    fileStream.on('error', (error) => {
      console.log(error);
      return res.status(500).send({ message: "Error reading the document", success: false });
    });
    fileStream.pipe(res);
  });
};

module.exports = {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
};
