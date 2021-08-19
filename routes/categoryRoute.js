const router = require("express").Router();
const CategoryController = require("../controllers/categoryController");


// create category
router.post("/", CategoryController?.create_category);

// get categories
router.get("/", CategoryController?.get_categories);

module.exports = router;