module.exports = (app) => {

    const jobs = require('../controllers/job.controller.js');

    // CREATE JOB
    app.post('/jobs', jobs.createJob);

    // GET ALL
    app.get('/jobs', jobs.findAllJob);

    // GET ONE
    app.get('/jobs/:slug', jobs.findOneJob);

    // DELETE
    app.delete('/jobs/:slug', jobs.deleteOneJob);

    // GET JOBS BY CATEGORY
    app.get('/categories/:slug/jobs', jobs.GetjobsByCategory);

    // UPDATE
    app.put('/jobs/:slug', jobs.updateJob);
}