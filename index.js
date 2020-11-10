var express=require("express");
var app=express();

app.set("view engine","ejs");
app.set("views","./views");
app.use(express.static("public"));
app.listen(3000);
//mongoose

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://adminos:v16vY9s8my3JgABN@cluster0.rwxhd.mongodb.net/Marvels?retryWrites=true&w=majority',
 {useNewUrlParser: true, useUnifiedTopology: true},function(err){
    if(err){
        console.log(new(Date)+"mongoose connect err "+ err);
    }else{
        console.log("Connect ok")
    }}
);
//
//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//
//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')//call back
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)//cấu hình tên file trên server
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp"  || file.mimetype=="image/gif"|| file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("marvelImage");

var Marvel=require("./Modules/marvel.js");
app.get("/",(req,res)=>{
    var captain=new Marvel({
        Name: "Catain",
        Image:"cap.jpg",
        Level:80
    });
    res.json(captain); 
});

app.get("/add",function(req,res){
    res.render("add");
});
app.post("/add",function(req,res){
   
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          //console.log("A Multer error occurred when uploading."); 
          res.json({"kq":0,"errMsg":" Multer error occurred when uploading"});
        } else if (err) {
          //console.log("An unknown error occurred when uploading." + err);
          res.json({"kq":0,"errMsg":" unknown error occurred when uploading"});
        }else{
   
            console.log("Upload is okay");

            var marvel=Marvel({
                Name:req.body.txtName,
                Image:req.file.filename,
                Level:req.body.txtLevel
            });
            marvel.save((err)=>{
                if (err){
                    res.json({"kq":0,"errMsg":err});
                }else{
                    res.json({"kq":1});
                }
                
            })
        }

    });
})