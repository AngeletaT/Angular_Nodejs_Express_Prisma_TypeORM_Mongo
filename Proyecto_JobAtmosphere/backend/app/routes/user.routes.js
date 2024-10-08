module.exports = (app) => {
    const userController = require("../controllers/user.controller.js");
    const { verifyJWT, logoutUser } = require("../middleware/verifyJWT");

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
};
