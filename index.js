const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const port =  process.env.PORT || 3000
const {sequelize,User} = require('./models')

app.use(express.json({ extended: false }))
// authentication
app.use("/api/user",require('./routes/api/user'))
app.use('/api/auth', require("./routes/api/auth"));
app.use("/api/password", require("./routes/api/forgetPassword"));

// Restaurant
app.use("/api/restaurant", require("./routes/api/restaurant"));

// dish
app.use("/api/dish", require("./routes/api/dish"));

// category
app.use("/api/category", require("./routes/api/category"));


app.listen(port,async()=>{
        // console.log(`example app listening on Port ${port}`)
    await sequelize.authenticate()
})