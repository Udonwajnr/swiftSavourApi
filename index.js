const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const {sequelize,User} = require('./models')
const cors = require("cors")
const cookieParser = require('cookie-parser')
const nodemailer = require("nodemailer")
const Mailgen = require('mailgen');
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");

app.use(express.json({ extended: false }))
app.use(cookieParser())
app.use(cors())
const port =  process.env.PORT || 4000

const storage = new Multer.memoryStorage();


cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
   });

        async function handleUpload(file) {
                const res = await cloudinary.uploader.upload(file, {
                resource_type: "auto",
        });
        return res;
        }

// const upload = Multer({
//         storage,
//       });
      



// app.post("/upload", upload.single("file"), async (req, res) => {
//         console.log(req.file);
//         console.log("done")
//       });

//       console.log(process.env.CLOUD_NAME)
app.get("/user",async(req,res)=>{
        const getUsers = await User.findAll({
        include: { all: true, nested: true }
                }
        )
        return res.json({user:getUsers})
})

app.get("/user/:uuid",async(req,res)=>{
        const uuid = req.params.uuid;
        const getUsers = await User.findOne({
                where:{uuid}
        })
        return res.json({user:getUsers})
})
app.delete("/user/:uuid",async(req,res)=>{
        const uuid = req.params.uuid;
        const getUsers = await User.destroy({
                where:{uuid}
        })
        return res.json({user:getUsers})
})
// test email

// app.post('/email',(req,res)=>{
//         let config = {
//                 service: 'gmail', // your email domain
//                 host:"smtp",
//                 port:587,
//                 secure:false,
//                 auth: {
//                     user: process.env.NODEJS_GMAIL_APP_USER, // your email address
//                     pass: process.env.NODEJS_GMAIL_APP_PASSWORD // your password
//                  }
//               }

//               let transporter = nodemailer.createTransport(config)
//               let message = {
//                 "from": 'udonwajnr10@gmail.com', // sender address
//                 "to": "umohu67@gmail.com", // list of receivers
//                 "subject": 'Welcome to swiftsavor Website!', // Subject line
//                 "html": "<b>Hello world?</b>", // html body
//                 "text":"Dear Recipient, thank you for subscribing",
//                 "attachments": [ 
//                         {
//                           "filename": 'note.txt',
//                           "path": 'note.txt',
//                           "cid": 'note.txt' 
//                         }
//                     ]
//             };
//             transporter.sendMail(message).then((info) => {
//                 return res.status(201).json(
//                     {
//                         msg: "Email sent",
//                         info: info.messageId,
//                         preview: nodemailer.getTestMessageUrl(info)
//                     }
//                 )
//             }).catch((err) => {
//                 return res.status(500).json({ msg: err });
//             }
//             );
// })

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
         //await sequelize.sync({alter:true}) //for OnCascadeDelete
           await sequelize.authenticate()
})