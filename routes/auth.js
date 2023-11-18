const router = require("express").Router();
const verify = require("../verifyToken");
const { loginController, registerController } = require("../controller/authController");

//Register
router.post("/register", registerController);

//login
router.post("/login", loginController);

module.exports = router;
