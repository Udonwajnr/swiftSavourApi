const {check} = require('express-validator')

exports.registerValidation = [
    check("firstName", "Name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("userName", "Username is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("phoneNumber", "Phone Number is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ];

  exports.loginValidation = [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ];