const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,

    },
    profilePic: {
      type: String,
      default: "",
    },
    about:{
      type:String,
      default:""

    },
    status:{
      type:String,
      default:"pending"
    },
    role:{
      type:String,
      default:"client_user"
    },
    confirmationCode:{
      type:String,
      unique:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);