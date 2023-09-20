const {success,error,validation} = require("../../helpers/responseApi")
const {randomString} = require("../../helpers/common")
const {validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {sequelize,User,Verification} = require('../../../models')
const dotenv = require("dotenv").config()


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
          "Your successfully verificating your account",
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