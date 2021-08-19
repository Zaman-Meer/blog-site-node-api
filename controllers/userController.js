const bcrypt = require("bcryptjs");
const User =require("../models/userModel");

// get user profile controller
const getUserProfile= async (req,res)=>{
    try {
        const user= await User.findOne({_id:req.params.id});
        if(user){
            const userInfo={
                profilePic:user?.profilePic,
                about:user?.about,
                username:user?.username,
                email:user?.email
            }
            res.json(userInfo)
        }
        else{
            res.status(400).json({
                message:"User profile not found!"
            })
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Server Error!"
        })
        
    }
}

//update user profile controller
const updateUserProfile= async (req,res)=>{
    if(req.body?.password){
        req.body.password= bcrypt.hashSync(req.body.password, 8);
    }

    try {
        const user= await User.findByIdAndUpdate(req.params.id,req.body,{
            new:true
        });
        if(user){
            // console.log("New user: ",user)
           res.json({ 
            message:"User Profile Updated."
           })

        }
        else{
            res.status(400).json({
                message:"User profile not found!"
            })
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Server Error!"
        })
        
    }
}


module.exports={
    getUserProfile,
    updateUserProfile,
}