const Job = require("../models/job.model.js");
const Category = require("../models/category.model.js");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.js");

// #region CREAR TRABAJO
const createJob = asyncHandler(async (req, res) => {
    const JobData = {
        name: req.body.name || null,
        salary: req.body.salary || 0,
        description: req.body.description || null,
        company: req.body.company || null,
        images: req.body.images,
        img: req.body.img || null,
        id_cat: req.body.id_cat || null,
    };

    const id_cat = req.body.id_cat;

    const category = await Category.findOne({ id_cat }).exec();

    if (!category) {
        return res.status(400).json({ message: "Ha ocurrido un error al buscar la categoria" });
    }

    const nuevoTrabajo = await new Job(JobData);
    await nuevoTrabajo.save();

    if (!nuevoTrabajo) {
        res.status(400).json({ message: "Ha ocurrido un error creando el trabajo" });
    }

    await category.addJob(nuevoTrabajo._id);

    return res.status(200).json({
        Job: await nuevoTrabajo.toJobResponse(),
    });
});

// #region LISTAR TODO
const findAllJob = asyncHandler(async (req, res) => {
    let query = {};
    let transUndefined = (varQuery, otherResult) => {
        return varQuery != "undefined" && varQuery ? varQuery : otherResult;
    };

    // console.log(req);

    let limit = transUndefined(req.query.limit, 5);
    let offset = transUndefined(req.query.offset, 0);
    let category = transUndefined(req.query.category, "");
    let name = transUndefined(req.query.name, "");
    let company = transUndefined(req.query.company, "");
    let salary_min = transUndefined(req.query.salary_min, 0);
    let salary_max = transUndefined(req.query.salary_max, Number.MAX_SAFE_INTEGER);
    let nameReg = new RegExp(name);
    let favorited = transUndefined(req.query.favorited, null);

    query = {
        name: { $regex: nameReg },
        $and: [{ salary: { $gte: salary_min } }, { salary: { $lte: salary_max } }],
    };

    if (category != "") {
        query.id_cat = category;
    }

    // Obtener el usuario si está logueado
    let user = null;
    if (req.loggedin) {
        try {
            user = await User.findById(req.userId);
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
        }
    }

    const jobs = await Job.find(query).limit(Number(limit)).skip(Number(offset));
    const Job_count = await Job.find(query).countDocuments();

    if (!jobs) {
        return res.status(404).json({ msg: "Ha ocurrido un error" });
    }

    return res.status(200).json({
        jobs: await Promise.all(
            jobs.map(async (job) => {
                return await job.toJobResponse(user);
            })
        ),
        Job_count: Job_count,
    });
});

// #region LISTAR UNO
const findOneJob = asyncHandler(async (req, res) => {
    const jobs = await Job.findOne(req.params);

    const user = await User.findById(req.userId);

    if (!jobs) {
        return res.status(401).json({
            message: "Trabajo no encontrado",
        });
    }
    return res.status(200).json({
        jobs: await jobs.toJobResponse(user),
    });
});

// #region LISTAR POR CATEGORIA
const GetjobsByCategory = asyncHandler(async (req, res) => {
    let offset = 0;
    let limit = 3;
    const { slug } = req.params;

    // Buscar la categoría por el slug
    const category = await Category.findOne({ slug }).exec();

    if (!category) {
        return res.status(400).json({ message: "Categoria no encontrada" });
    }

    // console.log("Categoría encontrada:", category);

    // Obtener los trabajos de la base de datos que coinciden con los IDs en category.jobs
    const jobs = await Promise.all(
        category.jobs.map(async jobId => {
            const job = await Job.findById(jobId).exec();
            if (job) {
                // console.log(`Job encontrado: ${job.name} con ID ${jobId}`);
                return job;
            } else {
                // console.log(`Job con ID ${jobId} no encontrado en la base de datos`);
                return null; // Manejo de trabajos no existentes
            }
        })
    );

    // Filtrar los trabajos válidos (los que existen en la base de datos)
    const validJobs = jobs.filter(job => job !== null);

    // Aplicar paginación sobre los trabajos válidos
    const paginatedJobs = validJobs.slice(offset, offset + limit);

    // Contar los trabajos válidos para el `Job_count`
    const Job_count = validJobs.length;

    // Generar la respuesta
    const user = await User.findById(req.userId);
    return res.status(200).json({
        jobs: await Promise.all(
            paginatedJobs.map(async job => await job.toJobResponse(user))
        ),
        Job_count: Job_count,
    });
});

// #region ACTUALIZAR
const updateJob = asyncHandler(async (req, res) => {
    // const userId = req.userId;

    const Job = req.body;
    const { slug } = req.params;
    // return res.json(req.params);
    // const loginUser = await User.findById(userId).exec();

    const target = await Job.findOne({ slug }).exec();

    if (Job.name) {
        target.name = Job.name;
    }
    if (Job.description) {
        target.description = Job.description;
    }
    if (Job.salary) {
        target.salary = Job.salary;
    }
    if (Job.company) {
        target.company = Job.company;
    }

    await target.save();
    return res.status(200).json({
        article: await target.toJobResponse(),
    });
});

// #region ELIMINAR
const deleteOneJob = asyncHandler(async (req, res) => {
    const slug = req.params;

    const job = await Job.findOne(slug).exec();

    if (!job) {
        res.status(400).json({ message: "Trabajo no encontrado" });
    }

    const id_cat = job.id_cat;
    const category = await Category.findOne({ id_cat }).exec();

    if (!category) {
        res.status(400).json({ message: "Ha ocurrido un error" });
    }

    await job.deleteOne({ _id: job._id });
    await category.removeJob(job._id);
    return res.status(200).json({
        message: "Trabajo eliminado",
    });
});

// #region FAVORITOS
const favoriteJob = asyncHandler(async (req, res) => {
    const id = req.userId;
    const { slug } = req.params;
    const loginUser = await User.findById(id).exec();
    if (!loginUser) {
        return res.status(401).json({
            message: "Usuario no encontrado",
        });
    }
    const job = await Job.findOne({ slug }).exec();
    if (!job) {
        return res.status(401).json({
            message: "Trabajo no encontrado",
        });
    }
    await loginUser.favorite(job._id);
    const updatedJob = await job.updateFavoriteCount();
    return res.status(200).json({
        job: await updatedJob.toJobResponse(loginUser),
    });
});

const unfavoriteJob = asyncHandler(async (req, res) => {
    const id = req.userId;
    const { slug } = req.params;
    const loginUser = await User.findById(id).exec();
    if (!loginUser) {
        return res.status(401).json({
            message: "Usuario no encontrado",
        });
    }
    const job = await Job.findOne({ slug }).exec();
    if (!job) {
        return res.status(401).json({
            message: "Trabajo no encontrado",
        });
    }
    await loginUser.unfavorite(job._id);
    await job.updateFavoriteCount();
    return res.status(200).json({
        job: await job.toJobResponse(loginUser),
    });
});

// #region TRABAJOS DE RECLUTADOR
const recruiterJobs = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Buscar el trabajo específico por su `jobId`
    const job = await Job.findById(id).exec();

    if (!job) {
        return res.status(404).json({
            message: "Trabajo no encontrado",
        });
    }

    // Obtener el usuario actual si está autenticado
    const user = req.userId ? await User.findById(req.userId) : null;

    // Aplicar `toJobResponse` para obtener los datos formateados del trabajo
    const jobResponse = await job.toJobResponse(user);

    return res.status(200).json({
        job: jobResponse,
    });
});

// #region EXPORTS
module.exports = {
    createJob,
    findAllJob,
    findOneJob,
    deleteOneJob,
    GetjobsByCategory,
    updateJob,
    favoriteJob,
    unfavoriteJob,
    recruiterJobs,
};
