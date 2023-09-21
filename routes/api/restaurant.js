const router = require("express").Router();
const {getRestaurant,createRestaurant,getRestaurantDetail,updateRestaurant,deleteRestaurant} = require("../../app/controllers/api/restaurantController")
const { restaurantValidation } = require("../../app/middleware/restaurantValidation")

router.post("/",restaurantValidation,createRestaurant)
router.get("/",getRestaurant)
router.get("/:uuid",getRestaurantDetail)
router.put("/:uuid",updateRestaurant)
router.delete("/:uuid",deleteRestaurant)

module.exports = router