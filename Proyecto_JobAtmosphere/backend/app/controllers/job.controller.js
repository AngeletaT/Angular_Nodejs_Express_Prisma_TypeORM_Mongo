const Job = require('../models/job.model.js');
const Category = require('../models/category.model.js');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

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
        Job: await nuevoTrabajo.toJobResponse()
    })
});

// #region LISTAR TODO
const findAllJob = asyncHandler(async (req, res) => {

    let query = {};
    let transUndefined = (varQuery, otherResult) => {
        return varQuery != "undefined" && varQuery ? varQuery : otherResult;
    };

    let limit = transUndefined(req.query.limit, 3);
    let offset = transUndefined(req.query.offset, 0);
    let category = transUndefined(req.query.category, "");
    let name = transUndefined(req.query.name, "");
    let company = transUndefined(req.query.company, "");
    let salary_min = transUndefined(req.query.salary_min, 0);
    let salary_max = transUndefined(req.query.salary_max, Number.MAX_SAFE_INTEGER);
    let nameReg = new RegExp(name);

    query = {
        name: { $regex: nameReg },
        $and: [{ salary: { $gte: salary_min } }, { salary: { $lte: salary_max } }],
    };

    if (category != "") {
        query.id_cat = category;
    }

    const jobs = await Job.find(query).limit(Number(limit)).skip(Number(offset));
    const Job_count = await Job.find(query).countDocuments();

    // return res.json(jobs)

    if (!jobs) {
        res.status(404).json({ msg: "Ha ocurrido un error" });
    }

    return res.status(200).json({
        jobs: await Promise.all(jobs.map(async Job => {
            return await Job.toJobResponse();
        })), Job_count: Job_count
    });
});

// #region LISTAR UNO
const findOneJob = asyncHandler(async (req, res) => {

    const jobs = await Job.findOne(req.params)

    if (!jobs) {
        return res.status(401).json({
            message: "Trabajo no encontrado"
        });
    }
    return res.status(200).json({
        jobs: await jobs.toJobResponse()
    })
});

// #region LISTAR POR CATEGORIA
const GetjobsByCategory = asyncHandler(async (req, res) => {

    // res.json("hola desde filtro categoria");
    let offset = 0;
    let limit = 3;
    const slug = req.params;
    let Job_count = "";

    const category = await Category.findOne(slug).exec();

    if (!category) {
        res.status(400).json({ message: "Categoria no encontrada" });
    }

    return await res.status(200).json({
        jobs: await Promise.all(category.jobs.map(async JobId => {
            const Trabajobj = await Job.findById(JobId).skip(offset).limit(limit).exec();
            return await Trabajobj.toJobResponse();
        })),
        Job_count: Job_count
    })
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
        article: await target.toJobResponse()
    })
});

// #region ELIMINAR
const deleteOneJob = asyncHandler(async (req, res) => {
    // return res.json("hola desde eliminar");
    const slug = req.params;

    // res.send(slug);
    const job = await Job.findOne(slug).exec();
    // res.send(Job);

    if (!job) {
        res.status(400).json({ message: "Trabajo no encontrado" });
    }

    const id_cat = job.id_cat
    // res.send(id_cat);
    const category = await Category.findOne({ id_cat }).exec();

    if (!category) {
        res.status(400).json({ message: "Ha ocurrido un error" });
    }

    await job.deleteOne({ _id: job._id });
    await category.removeJob(job._id)
    return res.status(200).json({
        message: "Trabajo eliminado"
    });
});


// #region EXPORTS
module.exports = {
    createJob,
    findAllJob,
    findOneJob,
    deleteOneJob,
    GetjobsByCategory,
    updateJob
}