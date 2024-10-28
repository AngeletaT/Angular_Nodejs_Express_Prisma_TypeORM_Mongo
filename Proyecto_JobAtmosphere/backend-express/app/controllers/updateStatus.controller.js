const asyncHandler = require('express-async-handler');
const Job = require('../models/job.model');
const User = require('../models/user.model');

const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { jobId, userId, newStatus } = req.body;

    // Verificar si el trabajo existe
    const job = await Job.findById(jobId).exec();
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }

    // Verificar que `application` exista y sea un array
    if (!job.application || !Array.isArray(job.application)) {
        return res.status(500).json({ message: "Job application data is missing or not formatted correctly" });
    }

    // Buscar y actualizar el estado de la aplicación en el trabajo
    const application = job.application.find(app => app.userId.toString() === userId);
    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }
    application.status = newStatus;
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
    inscription.status = newStatus;
    await user.save();

    return res.status(200).json({ message: "Application status updated successfully" });
});

module.exports = updateApplicationStatus;