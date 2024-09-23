module.exports = (app) => {

    const jobs = require('../controllers/job.controller.js');
    // const verifyJWT = require('../middleware/verifyJWT');
    // const verifyJWTOptional = require('../middleware/verifyJWTOptional.js');

    // CREATE JOB
    app.post('/jobs', jobs.createJob);

    // GET ALL
    app.get('/jobs', jobs.findAllJob);
    // app.get('/jobs', verifyJWTOptional, jobs.findAllJob);

    // GET ONE
    app.get('/jobs/:slug', jobs.findOneJob);
    // app.get('/jobs/:slug', verifyJWTOptional, jobs.findOneJob);

    // DELETE
    app.delete('/jobs/:slug', jobs.deleteOneJob);

    // GET JOBS BY CATEGORY
    app.get('/categories/:slug/jobs', jobs.GetjobsByCategory);
    // app.get('/categories/:slug', verifyJWTOptional, jobs.GetjobsByCategory);

    // FAVORITE
    // app.post('/:slug/favorite', verifyJWT, jobs.favouriteJob);

    // UNFAVORITE
    // app.delete('/:slug/favorite', verifyJWT, jobs.unfavoriteJob);

    // UPDATE
    app.put('/jobs/:slug', jobs.updateJob);
    // app.put('/jobs/:slug', verifyJWT, jobs.updateJob);
}