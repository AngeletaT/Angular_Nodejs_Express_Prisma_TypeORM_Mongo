const asyncHandler = require('express-async-handler');
const Job = require("../models/job.model.js");
const User = require("../models/user.model.js");

// Controlador para aplicar a un job
const applyToJob = asyncHandler(async (req, res) => {
    const { jobId } = req.body;
    const userId = req.userId;

    // Verificar si el trabajo existe en Mongoose
    const job = await Job.findById(jobId).exec();
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    // Verificar si el usuario ya ha aplicado
    const existingApplication = job.application.find(app => app.userId.toString() === userId);
    if (existingApplication) {
        return res.status(400).json({ message: "User already applied to this job" });
    }

    // Añadir la aplicación al trabajo
    job.application.push({ userId, status: "pending" });
    await job.save();

    // Actualizar las inscripciones del usuario
    const user = await User.findById(userId).exec();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.inscription.push({ jobId, status: "pending" });
    await user.save();

    return res.status(200).json({ message: "Successfully applied to the job" });
});

module.exports = {
    applyToJob
};