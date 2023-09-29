const {check} = require('express-validator')

exports.restaurantValidation =[
    check("name").notEmpty().withMessage("Name cannot be empty"),
    check("address").notEmpty().withMessage("Address cannot be empty"),
    check("latitude").notEmpty().withMessage("Latitude cannot be empty"),
    check("longitude").notEmpty().withMessage("Longitude cannot be empty"),
    check("rating").notEmpty().withMessage("Rating cannot be empty"),
    check("phoneNumber").notEmpty().withMessage("Phone Number cannot be empty"),
    check("deliveryTime").notEmpty().withMessage("Delivery Time cannot be empty"),
    check("logo").notEmpty().withMessage("logo cannot be empty"),
    check("image").notEmpty().withMessage("image cannot be empty"),
    check("state").notEmpty().withMessage("state cannot be empty"),
    check("country").notEmpty().withMessage("country  cannot be empty"),
    check("city").notEmpty().withMessage("city cannot be empty")
]