const {success,error,validation} = require("../../helpers/responseApi");
const {randomString} = require("../../helpers/common")
const {sequelize,Verification,User} =require("../../../models")
const bcrypt = require("bcryptjs");

/**
 * @desc    Forgot user password
 * @method  POST api/password/forgot
 * @access  public
 */

exports.forgot = async (req,res)=>{
    const { email } = req.body;

    // Check the token
  if (!email){
  return res.status(422).json(validation([{ msg: "Email is required" }]))};


  try{
  
    const user = await User.findOne({where:{ email: email.toLowerCase() }});
    

    // Check the user
    if (!user){
      return res.status(404).json(error("User not found", res.statusCode));
    }

    // If user exists
       // We're gonna make a new verification data

      let verification = await Verification.findOne({where:{
          userId: user.id,
          type: "Forgot Password"
        }});
        

        if (verification) {
        verification = await Verification.destroy({
            where:{id:verification.id}
        });
        }

          // Create a new verification data
    let newVerification = await Verification.create({
        token: randomString(50),
        userId: user.id,
        type: "Forgot Password"
      });

      // Send the response
    res
    .status(201)
    .json(
      success(
        "Forgot Password verification has been sent",
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
 * @desc    Resetting user password
 * @method  POST api/password/reset
 * @access  public
 */

exports.reset =async(req,res)=>{
  const { token, password } = req.body;
   // Check the token first
   if (!token){
   return res.status(422).json(validation([{ msg: "Token is required" }]))}

     // Check the password
  if (!password){
     return res.status(422).json(validation([{ msg: "Password is required" }]));
    }

    try{

      let verification = await Verification.findOne({where:{
        token,
        type: "Forgot Password"
      }});

      // Check the verification data
    if (!verification){
    return res
      .status(400)
      .json(
        error("Token / Data that you input is not valid", res.statusCode)
      );}

      // If there's verification data
    // Let's find the user first
    let user = await User.findByPk(verification.userId);


    // Check the user, just in case
    if (!user){
    return res.status(404).json(error("User not found", res.statusCode));
    }

    // if those condition all passed
    // Let's update the password
    // Don't forget to hash the password using bcrypt
    let hash = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, hash);

    user = await User.findOne({where:{ id: user.id }})
    user.password=hashedPassword

    await user.save()

    // Lets delete the verification data
    verification = await Verification.destroy({where:{id:verification.id}});

    res
    .status(200)
    .json(success("Password has been updated", null, res.statusCode));

    }
    catch(err){
      console.error(err.message);
      res.status(500).json(error("Server error", res.statusCode));  
    }
}