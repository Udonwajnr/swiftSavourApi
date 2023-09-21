const router = require("express").Router();
const {getUsers}  = require('../../app/controllers/api/userController')

router.get('/',getUsers)
module.exports = router;
