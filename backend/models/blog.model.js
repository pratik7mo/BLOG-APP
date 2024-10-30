import mongoose from "mongoose";
// import validator from "validator";

const blogSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    blogImage:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    },
    category:{
        type:String,
        required:true,
    },
    about:{
        type:String,
        required:true,
        minLength:[200,"Should contains atleast 200 characters"]
    },
    adminName:{
        type:String,
        
    },
    adminPhoto:{
        type:String,
        
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
    }
})
export const Blog=mongoose.model("Blog",blogSchema)