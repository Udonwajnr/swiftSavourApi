const router = require("express").Router();
const {getCategory,createCategory,deleteCategory,getCategoryDetail,updateCategory} = require("../../app/controllers/api/categoryController")

router.get("/",getCategory)
router.post("/",createCategory)
router.get("/:uuid",getCategoryDetail)
router.put("/:uuid",updateCategory)
router.delete("/:uuid",deleteCategory)

module.exports = router