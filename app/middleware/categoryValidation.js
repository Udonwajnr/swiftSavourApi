const {check} = require('express-validator')

exports.categoryValidation =[
    check("name").notEmpty().withMessage("Name cannot be empty"),

]