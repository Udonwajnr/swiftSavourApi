const {User} =require("../../../models")
const asyncHandler = require('express-async-handler')
 

exports.getUsers = asyncHandler(async(req,res)=>{
        const users = await User.findAll()
        return res.json({users:users})
    })
