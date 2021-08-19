const express = require("express");
const cors = require('cors');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const categoryRoute = require("./routes/categoryRoute");
const multer = require("multer");
const path = require("path");
const TokenVerify = require("./middlewares/authMiddleware")
app.use(cors());

dotenv.config();

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false, 

  })
  .then(()=>{
    console.log("Connected to MongoDB")
    let port =process.env.PORT;
    if(port== null || port == "") {
      port = 5000;
    }
    app.listen(port, () => {
      console.log(`Backend is running: ${port}`);
    });
      
  }  
  )
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/v1/upload",TokenVerify , upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/categories", categoryRoute);
