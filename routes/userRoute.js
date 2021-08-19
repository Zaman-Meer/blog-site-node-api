const router = require("express").Router();
const tokenVerify = require("../middlewares/authMiddleware");
const UserController = require("../controllers/userController");


// get user profile info
router.get("/:id", UserController.getUserProfile);

// update user profile info
router.patch("/:id",tokenVerify, UserController.updateUserProfile);



module.exports=router;