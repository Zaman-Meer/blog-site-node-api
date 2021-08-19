const router = require("express").Router();
const tokenVerify = require("../middlewares/authMiddleware");
const PostController = require("../controllers/postController");




// get  posts
router.get("/", PostController?.get_posts);

// get recent posts
router.get("/latest", PostController?.get_recent_posts);


// get home page posts
router.get("/home", PostController?.get_home_page_posts);


// get post 
router.get("/:id", PostController?.get_post);

// create post 
router.post("/",tokenVerify, PostController?.create_post );

// update post 
router.patch("/:id",tokenVerify, PostController?.update_post);

// delete post 
router.delete("/:id", tokenVerify, PostController?.delete_post);


module.exports = router;