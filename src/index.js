import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port:: ${process.env.PORT}`);
      app.on("Error", (error) => {
        console.log("app error :", error);
      });
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed: ", err);
  });

/*
import express from "express"
const app = express();

(async () => {
    try{
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       app.on("Error:",(error)=>{
        console.log("error:", error);
        throw error      
       })
         app.listen(process.env.PORT,()=>{
            console.log(`listing on port ${process.env.PORT}`);
            
        })
    }catch{

        console.error("Error:", error );
        throw err
    }
})();
*/
//DB can be connected like this but is not a good approach
