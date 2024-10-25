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