const router = require("express").Router();
const {getDish,createDish,deleteDish,getDishDetail,updateDish} = require("../../app/controllers/api/dishController")
const { dishValidation } = require("../../app/middleware/dishValidation")

router.get("/",getDish)
router.post("/",dishValidation,createDish)
router.get("/:uuid",getDishDetail)
router.put("/:uuid",dishValidation,updateDish)
router.delete("/:uuid",deleteDish)
module.exports = router