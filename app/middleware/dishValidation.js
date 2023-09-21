const {check} = require('express-validator')

exports.dishValidation =[
    check("name").notEmpty().withMessage("Name cannot be empty"),
    check("price").notEmpty().withMessage("price cannot be empty"),
    check("description").notEmpty().withMessage("description cannot be empty"),
    check("image").notEmpty().withMessage("image Time cannot be empty")
]