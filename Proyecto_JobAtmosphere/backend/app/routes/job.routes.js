module.exports = (app) => {
    const jobs = require("../controllers/job.controller.js");
    const { verifyJWT } = require("../middleware/verifyJWT");
    const verifyJWTOptional = require("../middleware/verifyJWTOptional.js");

    // CREATE JOB
    app.post("/jobs", jobs.createJob);

    // GET ALL
    app.get("/jobs", jobs.findAllJob);

    // GET ONE
    app.get("/jobs/:slug", verifyJWT, jobs.findOneJob);

    // DELETE
    app.delete("/jobs/:slug", jobs.deleteOneJob);

    // GET JOBS BY CATEGORY
    app.get("/categories/:slug/jobs", verifyJWTOptional, jobs.GetjobsByCategory);

    // UPDATE
    app.put("/jobs/:slug", jobs.updateJob);

    //FAVORITE
    app.post("/:slug/favorite", verifyJWT, jobs.favouriteJob);

    //UNFAVORITE
    app.delete("/:slug/favorite", verifyJWT, jobs.unfavoriteJob);
};
