const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User =require("../models/userModel")
const {sendRegisterConfirmationEmail,sendPasswordResetConfirmationEmail} =require("../services/nodeMailer")
const Post = require("../models/postModel");
 

// signup controller
const signUp = async (req, res) => {
  // for  rest user collection
  // const dp=await User.collection.drop();
  // console.log("Drop",dp)
  // const del =await User.deleteMany();
  // console.log("Delete",del)
 try {
    const oldUser=await User.findOne({email:req.body.email},"status");
    console.log("Old",oldUser);
    if(oldUser){
        if(oldUser?.status==="active"){
           return res.json({
                message:
                  "Email is already exist. Please go to login page to login with this email.",
             });
        }
        else{
            return res.json({
                message:
                  "Activation link is already send to this email. Please check your email inbox.",
             });
        }

    }else{

        const token = jwt.sign({email: req.body.email}, process.env.SECRET_KEY)
        const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        confirmationCode:token
      });
        newUser= await user.save();
        if(newUser){

            res.json({
                message:
                  "User was registered successfully! Please check your email inbox",
             });
             sendRegisterConfirmationEmail(
              newUser.username, 
              newUser.email,
              newUser.confirmationCode,
              newUser.profilePic
       );

        }
    }

     
 } catch (error) {
     console.log("ERR",error)
    res.status(500).json({ message: "Server Error" });
 }
};



// sign in controller
 const signIn = async (req, res) => {

   
    try {
        const user = await User.findOne({ email: req.body.email });
        if(user){
            if(user.status==="pending"){
                res.status(400).json({
                    message:
                      "Email verification is pending. Please check your email inbox.",
                 });
            }

            else{

                let passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                  );
            
                  if (!passwordIsValid) {
                    return res.status(401).json({
                      accessToken: null,
                      message: "Invalid Password!"
                    });
                  }
                var token = jwt.sign({ id: user.id, role: user?.role }, process.env.SECRET_KEY, {
                    expiresIn: 86400 // 24 hours
                  });
            
                
                  res.status(200).json({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    accessToken: token,
                    profilePic:user.profilePic
                  });
                  console.log("LoginDone")
            }
        }
        else{
            return res.status(400).json({ message: "User Not found." });
        }
        
    } catch (error) {
      console.log("Error",error)
        res.status(500).json({ message: "Server Error" });
      
    }

    
};

// email verification code controller
const verifyEmailConfirmationCode= async (req,res)=>{
  try {
      const user=await User.findOne({confirmationCode:req.params.confirmationCode});
      if(user){
        if(user.status==="pending"){
          user.status="active";
          const updatedUser= await user.save();
          
          if(updatedUser){
              return  res.json({
                  message:
                    "Account is verified. Redirecting to Login page...",
               });
          }
        }
        else{
          res.status(400).json({
            message:
              "Activation link is expired or invalid!",
         });
        }
         
      }
      else{
          res.status(400).json({
              message:
                "Activation link is expired or invalid!",
           });
      }

  } catch (error) {
    console.log("Error",error)
      res.status(500).json({ message: "Server Error" });
  }
}


// Password reset email confirmation controller
const resetPasswordEmailConfirm = async (req, res) => {

 try {
    const oldUser=await User.findOne({email:req.body.email},"status");
    console.log("Old",oldUser);
    if(oldUser?.status==="active"){
      const token = jwt.sign({email: req.body.email}, process.env.SECRET_KEY);
      const data={confirmationCode:token};
      const updatedUser= await User.findByIdAndUpdate(oldUser?._id,{$set:data},{ new: true });
      if(updatedUser){
        res.json({
          message:
            "Password reset link is send to this email. Please check your email inbox.",
       });
        sendPasswordResetConfirmationEmail(
          updatedUser.username, 
          updatedUser.email,
          updatedUser.confirmationCode
          );
      }

    }else{
      return res.status(403).json({
        message:
          "Email does not exist. Please go to register page to register with this email.",
     });
    }

     
 } catch (error) {
     console.log("ERR",error)
    res.status(500).json({ message: "Server Error" });
 }
};




// email verification code controller
const verifyPasswordResetConfirmationCode= async (req,res)=>{
  try {
      const user=await User.findOne({confirmationCode:req.params.confirmationCode},"status");

      if(user){
        
        if(user?.status==="active")  {

              return  res.json({
                  message:
                    "Verification is done!. Now you can reset password.",
               });
        }
        else{
          res.status(400).json({
            message:
              "Reset password is expired or invalid!",
         });
        }
         
      }
      else{
          res.status(400).json({
              message:
                "Reset password link is expired or invalid!",
           });
      }

  } catch (error) {
    console.log("Error",error)
    res.status(400).json({
      message:
        "Reset password link is expired or invalid!",
   });
  }
}


// reset user password 

const resetPassword= async (req,res)=>{
  try {
      const user=await User.findOne({confirmationCode:req.body?.confirmationCode});
      if(user){
        if(user.status==="active"){
          const data= {
            password:bcrypt.hashSync(req.body.password, 8),
            confirmationCode:""
          }
          const updatedUser= await User.findByIdAndUpdate(user?._id,{$set:data},{ new: true });
          
          if(updatedUser){
              return  res.json({
                  message:
                    "Password Reset successfully!. Redirecting to Login page...",
               });
          }
        }
        else{
          res.status(500).json({ message: "Server Error" });
        }
         
      }
      else{
          res.status(400).json({
              message:
                "Reset password link is expired or invalid!",
           });
      }

  } catch (error) {
    console.log("Error",error)
    res.status(400).json({
      message:
        "Reset password link is expired or invalid!",
   });
  }
}


module.exports={
    signIn,
    signUp,
    resetPassword,
    verifyEmailConfirmationCode,
    verifyPasswordResetConfirmationCode,
    resetPasswordEmailConfirm,

    

}