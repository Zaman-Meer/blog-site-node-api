const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    categories: {
      type: Array,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);