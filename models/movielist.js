var mongoose = require("mongoose");
var movieSchema = new mongoose.Schema({
    moviename : String,
    image : String,
    imageId : String,
    description:String,
    createdtime:{type:Date,default:Date.now},
    author:{
        id:{
          type:mongoose.Schema.ObjectId,
          ref:"User"
        },
        username:String
    },
    comment:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Comment"
    }
    ]
});

module.exports = mongoose.model("Movies",movieSchema);