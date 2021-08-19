const Post = require("../models/postModel");
const User =require("../models/userModel");
const Category = require("../models/categoryModel");
const { post } = require("../routes/authRoute");


// create post controller
const create_post = async (req, res) => {
  const PostTitle=req.body?.title;
    try {
      const oldPost= await Post.findOne({title:PostTitle});
      if(oldPost){
        res.status(409).json({
          message:"Same post title already exist!"
        })
      }
      else{
        if(req.body?.authorId === req?.user?.id) {
          const newPost = new Post(req.body);
          const savedPost = await newPost.save();
          console.log("New Post Created!")
          res.status(200).json({
            message:"Post created successfully!",
            id:savedPost?._id
          });
        }
        else{
          res.status(401).json({message:"You are not authorize to create post!"});
        }

      }
   
    } catch (err) {
      console.log("Post Error",err)
      res.status(500).json({
        message:"Server error!"
      });
    }
  }

  // update post controller
const update_post = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.authorId === req?.user?.id || req.user?.role === "admin") {
        try {
          const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json({
            message:"Post updated successfully",
            id:updatedPost?._id
          });
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json({message:"You are not authorize to update this post!"});
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // delete post controller 
 const delete_post =  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post?.authorId === req?.user?.id || req.user?.role === "admin") {
        try {
          await post.delete();
          res.status(200).json("Post has deleted!");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json({message:"You are not authorize to delete this post!"});
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }


// get post controller 
const get_post =  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const user= await User.findOne({_id:post?.authorId},"username profilePic");
      const postData={
        authorId:post?.authorId,
        authorName:user?.username,
        authorPic:user?.profilePic,
        _id:post?._id,
        imgUrl:post?.imgUrl,
        title:post?.title,
        categories:post?.categories,
        description:post?.description,
        createdAt:post?.createdAt,
        updatedAt:post?.updatedAt,
      }

   

      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  }

//get recent post controller

const get_recent_posts =  async (req, res) => {
    try {
      const posts= await Post.find({},"title imgUrl").sort({createdAt:"desc"}).limit(4);
    
      res.status(200).json(posts);
    } catch (err) {
      console.log("get_latest_post_error",err)
      res.status(500).json(err);
    }
  }

  // get home page post controller

  const get_home_page_posts = async (req, res) => {
    try {
        const categories = await Category.find({},"name");
      let homePosts=[];
  
      for(let category of categories){
        const posts= await Post.find({categories:{ $all: [category?.name]}},"title imgUrl").sort({createdAt:"desc"}).limit(3);
       homePosts=[...homePosts,{category,posts}]
      }
       res.status(200).json(homePosts);
    } catch (err) {
      console.log("home_posts_error",err)
      res.status(500).json(err);
    }
  } 


//get posts controller

const get_posts =  async (req, res) => {

  try {
    const query=req.query;
    let filters=(query?.authorId&&query?.category)?{authorId:query?.authorId,categories:{ $all: [query?.category]}}:query?.authorId?{authorId:query?.authorId}:query?.category?{categories:{ $all: [query?.category]}}:{}

    const posts= await Post.find(filters,"imgUrl title").sort({createdAt:"desc"})
 
   const filterPosts=posts.slice(parseInt(query?.offset,)).slice(0,12)
 
    res.status(200).json({
      posts:filterPosts,
      totalPosts:posts?.length
    });
  } catch (err) {
    console.log("get_post_error",err)
    res.status(500).json(err);
  }
}



  module.exports={
      create_post,
      update_post,
      delete_post,
      get_post,
      get_posts,
      get_recent_posts,
      get_home_page_posts
  }




