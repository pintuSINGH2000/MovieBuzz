const router = require("express").Router();
const  formidable = require ("express-formidable");
const { loginController, registerController, braintreeTokenController,verifyEmailController, updateUserController } = require("../controller/authController");


//verify email
router.post("/verify-email", verifyEmailController);
//Register
router.post("/register", registerController);

//login
router.post("/login", loginController);

// updateUser
router.put("/update-user/:userid",formidable(), updateUserController);

//getToken
router.get('/braintree/token',braintreeTokenController);


module.exports = router;
