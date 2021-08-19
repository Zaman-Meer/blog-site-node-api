const router = require("express").Router();
const AuthController = require("../controllers/authController");


// login user
router.post("/login", AuthController.signIn);
 
//signUp user 
router.post("/register", AuthController.signUp);

// email verify code
router.post("/activation/:confirmationCode", AuthController.verifyEmailConfirmationCode)

// reset password email confirm
router.post("/reset-password-email-confirm",AuthController.resetPasswordEmailConfirm)

// password reset verify code
router.post("/reset/:confirmationCode", AuthController.verifyPasswordResetConfirmationCode)

//reset password 

router.post("/password-reset",AuthController.resetPassword)

module.exports=router;