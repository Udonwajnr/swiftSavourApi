const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const port =  process.env.PORT || 3000
const {sequelize,User} = require('./models')

app.use(express.json())
app.post("/user",async(req,res)=>{
    const {firstName,lastName,email,phoneNumber,password} = req.body
    try{
        const user = await User.create({firstName,lastName,email,phoneNumber,password})
        return res.json(user)
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

app.listen(port,async()=>{
        // console.log(`example app listening on Port ${port}`)
    await sequelize.sync({alter:true})
})