const asyncHandler = require('express-async-handler');  // Asegúrate de importar esto
const Job = require("../models/job.model.js");
const User = require("../models/user.model.js");

// Controlador para aplicar a un job
const applyToJob = asyncHandler(async (req, res) => {
    const { jobId } = req.body;  // jobId enviado en el cuerpo de la solicitud
    const userId = req.userId;    // userId de la solicitud autenticada

    // Verificar si el trabajo existe
    const job = await Job.findById(jobId).exec();
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    // Verificar si el usuario ya ha aplicado
    const existingApplication = job.aplication.find(app => app.userId.toString() === userId);
    if (existingApplication) {
        return res.status(400).json({ message: "User already applied to this job" });
    }

    // Añadir la aplicación al trabajo
    job.aplication.push({ userId, status: "pending" });
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

// Controlador para actualizar el estado de una aplicación
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { jobId, userId, newStatus } = req.body;  // Se espera jobId, userId y nuevo estado

    // Verificar si el trabajo existe
    const job = await Job.findById(jobId).exec();
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    // Actualizar el estado de la aplicación en el trabajo
    const application = job.aplication.find(app => app.userId.toString() === userId);
    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }
    application.status = newStatus;  // Actualizar el estado de la aplicación
    await job.save();

    // Actualizar el estado en el array de inscriptions del usuario
    const user = await User.findById(userId).exec();
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const inscription = user.inscription.find(ins => ins.jobId.toString() === jobId);
    if (!inscription) {
        return res.status(404).json({ message: "Inscription not found" });
    }
    inscription.status = newStatus;  // Actualizar el estado en las inscripciones
    await user.save();

    return res.status(200).json({ message: "Application status updated successfully" });
});

module.exports = {
    applyToJob,
    updateApplicationStatus
};