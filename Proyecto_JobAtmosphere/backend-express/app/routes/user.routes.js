module.exports = (app) => {
    const userController = require("../controllers/user.controller.js");
    const { verifyJWT, logoutUser } = require("../middleware/verifyJWT");
    const { applyToJob } = require("../controllers/application.controller.js");
    const updateApplicationStatus = require("../controllers/updateStatus.controller.js");
    const verifyJWTOptional = require("../middleware/verifyJWTOptional");
    const followCompany = require("../controllers/follow.controller");

    // Authentication
    app.post("/users/login", userController.userLogin);

    // Registration
    app.post("/users/register", userController.registerUser);

    // Logout
    app.post("/users/logout", logoutUser);

    // Get Current User
    app.get("/user", verifyJWT, userController.getCurrentUser);

    // Update User
    app.put("/user", verifyJWT, userController.updateUser);

    // Profile User
    app.get("/user/profile", verifyJWT, userController.getUserProfile);

    // Apply to Job
    app.post("/user/apply", verifyJWTOptional, applyToJob);

    // Update Application Status
    app.put("/user/application/status", updateApplicationStatus);

    // Follow Company
    app.post("/user/follow", verifyJWT, followCompany);

    // Get User By ID
    app.get("/user/:id", userController.getUserById);
};