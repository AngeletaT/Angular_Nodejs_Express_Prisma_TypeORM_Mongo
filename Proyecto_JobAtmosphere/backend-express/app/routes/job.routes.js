module.exports = (app) => {
    const jobs = require("../controllers/job.controller.js");
    const { verifyJWT } = require("../middleware/verifyJWT");
    const verifyJWTOptional = require("../middleware/verifyJWTOptional.js");

    // CREATE JOB
    app.post("/jobs", jobs.createJob);

    // GET ALL
    app.get("/jobs", verifyJWTOptional, jobs.findAllJob);

    // GET ONE
    app.get("/jobs/:slug", verifyJWTOptional, jobs.findOneJob);

    // DELETE
    app.delete("/jobs/:slug", jobs.deleteOneJob);

    // GET JOBS BY CATEGORY
    app.get("/categories/:slug/jobs", verifyJWTOptional, jobs.GetjobsByCategory);

    // UPDATE
    app.put("/jobs/:slug", jobs.updateJob);

    //FAVORITE
    app.post("/:slug/favorite", verifyJWT, jobs.favoriteJob);

    //UNFAVORITE
    app.delete("/:slug/favorite", verifyJWT, jobs.unfavoriteJob);

    //RECRUITER JOBS
    app.get("/job/:id", jobs.recruiterJobs);
};