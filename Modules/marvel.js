var  mongoose =require("mongoose");
var  schemaMarel=new mongoose.Schema({
    Name: String,
    Image:String,
    Level:Number
});
module.exports=mongoose.model("Marve",schemaMarel);