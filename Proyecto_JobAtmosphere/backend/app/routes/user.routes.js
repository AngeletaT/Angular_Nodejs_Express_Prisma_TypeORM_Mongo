module.exports = (app) => {
    const userController = require("../controllers/user.controller.js");
    const { verifyJWT, verifyRefreshToken } = require("../middleware/verifyJWT");

    // Authentication
    app.post("/users/login", userController.userLogin);

    // Registration
    app.post("/users", userController.registerUser);

    // Get Current User
    app.get("/user", verifyJWT, userController.getCurrentUser);

    // Update User
    app.put("/user", verifyJWT, userController.updateUser);

    // Refresh Token
    app.post("/users/refresh-token", verifyRefreshToken, userController.refreshToken);

    // Logout
    app.post("/users/logout", verifyJWT, userController.logout);
};
