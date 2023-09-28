const {success,error,validation} = require("../../helpers/responseApi")
const {randomString} = require("../../helpers/common")
const {validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {sequelize,User,Verification} = require('../../../models')
const dotenv = require("dotenv").config()
const nodemailer = require("nodemailer")

/**
 * @desc    Register a new user
 * @method  POST api/auth/register
 * @access  public 
 */


exports.register = async(req,res) =>{
    //Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()){
         return res.status(422).json(validation(errors.array()));
    }

    const {firstName,lastName,userName,email,phoneNumber,password} = req.body
    try{
        const user = await User.findOne({
            where: {
            email: email.toLowerCase().replace(/\s+/, "")
          } 
          });
          // Check the user email to know if user already exist

          if(user){
            return res.status(422).json(validation({msg:"Email already registered"}));
          }

          let data = {
            firstName,
            lastName,
            userName,
            email,
            phoneNumber,
            password:await bcrypt.hash(password, 10)}

            // save user
            let newUser = await User.create(data)

            console.log(newUser.id)

            // / Save token for user to start verificating the account

            let verificationData = {
                token: randomString(50),
                userId: newUser.id,
                type: "Register New Account",
              };

            let verification = await Verification.create(verificationData)
            
              // sending verification mail
            let config = {
              service: 'gmail', // your email domain
              host:"smtp",
              port:587,
              secure:false,
              auth: {
                  user: process.env.NODEJS_GMAIL_APP_USER, // your email address
                  pass: process.env.NODEJS_GMAIL_APP_PASSWORD // your password
               }
            }

            let transporter = nodemailer.createTransport(config)
            let message = {
              "from": 'udonwajnr10@gmail.com', // sender address
              "to": "umohu67@gmail.com", // list of receivers
              "subject": 'Welcome to swiftsavor Website!', // Subject line
              "html": `http://localhost:3000/verifysuccessful/${verification.token}`, // html body
              "text":"Dear Recipient, thank you for subscribing",
          };
          transporter.sendMail(message).then((info) => {
              console.log("sent")
          }).catch((error)=>{
            console.log(error)
          })

              // verification mail ending
            res.status(201).json(success(
              "Register success, please activate your account.",
              {user: {newUser},
              verification:{verification}
            },
              res.statusCode
              ))
                
    }
    catch(err){
        console.error(err.message);
        res.status(500).json(error("Server error", res.statusCode));
    }
}
/**
 * @desc    Verify a new user
 * @method  GET api/auth/verify/:token
 * @access  public
 */

exports.verify = async(req,res)=>{
  const {token} = req.params;

  try{
    let verification = await Verification.findOne({
    where:{  
      token,
      type: "Register New Account",
    }

    });

     // Check the verification data
     if (!verification){
     return res
       .status(404)
       .json(error("No verification data found", res.statusCode));
    }

      // If verification data exists
    // Get the user data
    // And activate the account
    
    let user = await User.findOne({where:{ id: verification.userId }})

    user.verified = true,
    user.verifiedAt = new Date(),

   await user.save() 
   verification = await Verification.destroy({
    where:{id:verification.id}
  });
  res
      .status(200)
      .json(
        success(
          "Your successfully verifying your account",
          null,
          res.statusCode
        )
      );

  }
  catch(err){
    console.log(err);
    res.status(500).json(error("Server error", res.statusCode));
  }
}

/**
 * @desc    Login a user
 * @method  POST api/auth/login
 * @access  public
 */


exports.login =async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(422).json(validation(errors.array()));}

  const { email, password } = req.body;
  try{
    const user = await User.findOne({where:{ email }});
    // Check the email
    // If there's not exists
    // Throw the error
    if (!user) return res.status(422).json(validation("Invalid credentials"));
    // Check the password
    let checkPassword = await bcrypt.compare(password, user.password);
    
    if (!checkPassword){
      return res.status(422).json(validation("Invalid credentials"));}

    // Check user if not activated yet
    // If not activated, send error response
    
    if (user && !user.verified){
      return res
        .status(400)
        .json(error("Your account is not active yet.", res.statusCode));
      }

      //  If the requirement above pass
      // Lets send the response with JWT token in it
      const payload = {
        user: {
          id: user.id,
          name: user.userName,
          email: user.email,
        },
      };

      jwt.sign(
        payload,
        process.env.JWTKey,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
  
          res
            .status(200)
            .json(success("Login success", { token }, res.statusCode));
        }
      );

  }
  catch(err){
    console.log(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
}

/**
 * @desc    Resend new verification token to user
 * @method  POST api/auth/verify/resend
 * @access  public
 */

exports.resendVerification = async(req,res)=>{
  const {email} = req.body

  // Simple checking for email
  if (!email)
    return res.status(422).json(validation([{ msg: "Email is required" }]));

    try{
      const user = await User.findOne({where:{ email: email.toLowerCase() }});
      //  Check the user first
      if (!user){
        return res.status(404).json(error("Email not found", res.statusCode));
            }
            
      // If user exists
    // We gonna get data from verification by user ID
    let verification = await Verification.findOne({where:{
      userId: user.id,
      type: "Register New Account",
    }});

    // If there's verification data
    // Remove previous verification data and create a new one
    if (verification) {
      verification = await Verification.destroy({
        where:{id:verification.id}
      });
    }

     // Create a new verification data
    let newVerification = await Verification.create({
      token: randomString(50),
      userId: user.id,
      type: "Register New Account",
    });
    
    res
    .status(201)
    .json(
      success(
        "Verification has been sent",
        { verification: newVerification },
        res.statusCode
      )
    );
    }
      catch(err){
        console.error(err.message);
        res.status(500).json(error("Server error", res.statusCode));
    }
}

/**
 * @desc    Get authenticated user
 * @method  GET api/auth
 * @access  private
 */

exports.getAuthenticatedUser=async(req,res)=>{
  try{
    const user = await User.findByPk(req.user.id)
  if (!user){
    return res.status(404).json(error("User not found", res.statusCode));
  }
// Send the response
    res
      .status(200)
      .json(success(`Hello ${user.userName}`, { user }, res.statusCode));


  }catch(err){
    console.error(err.message);
    res.status(500).json(error("Server error", res.statusCode));
  }
}