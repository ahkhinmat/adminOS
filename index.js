/*Cấu hình server */
var express=require("express");
var app=express();
app.set("view engine","ejs");
app.set("views","./views");
//app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
app.listen(3000);
/*Cấu hình server*/
//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://adminios:jFrN3z6qzYc0ZhmJ@cluster0.vxam6.mongodb.net/Matvels?retryWrites=true&w=majority',

 {useNewUrlParser: true, useUnifiedTopology: true},function(err){
    if(err){
        console.log(new(Date)+"mongoose connect err "+ err);
    }else{
        console.log("Connect dữ liệu ok")
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
         
          res.json({"kq":0,"errMsg":" Multer error occurred when uploading"});
        } else if (err) {
         
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
                    //res.json({"kq":1});
                    res.redirect("./list");
                }
                
            })
        }
    });
})
app.get("/list",(req,res)=>{
    Marvel.find(function(err,data){
        if(err){
            res.json({"kq":0,"errMsg":err})
        }else{
            res.render("list",{danhsach:data});
            //res.send("kkk");
        }
    })
});
app.get("/edit/:id",(req,res)=>{
    Marvel.findById(req.params.id,function(err,char){
        if(err){
            res.json({"kq":0,"errMsg":err});
        }   else{
            //console.log(char);
            res.render("edit",{nhanvat:char});
        }
    })
   
});
app.post("/edit",(req,res)=>{
    
    upload(req, res, function (err) {
       //nếu không chọn hình
        
        if(!req.file){
            Marvel.updateOne({ _id:req.body.IDChar},{
                Name:req.body.txtName,
                Level:req.body.txtLevel 
              }, function(err){
                if(err){
                    res.json({"kq":0,"Lỗi cập nhật Db":err});
                }else{
                    res.redirect("./list");
                }
              })
        }else{
            //Nếu chọn hình
            if (err instanceof multer.MulterError) {
            
                res.json({"kq":0,"errMsg":" Multer error occurred when uploading"});
              } else if (err) {
               
                res.json({"kq":0,"errMsg":" unknown error occurred when uploading"+err});
              }else{
                Marvel.updateOne({ _id:req.body.IDChar},{
                  Name:req.body.txtName,
                  Image:req.file.filename,
                  Level:req.body.txtLevel 
                }, function(err){
                  if(err){
                      res.json({"kq":0,"Lỗi cập nhật Db":err});
                  }else{
                      res.redirect("./list");
                  }
                })
              }
        }
  
        //nếu chọn hình
    });
});
app.get("/delete/:id/",(req,res)=>{
    Marvel.deleteOne({_id:req.params.id},(err)=>{
        if(err){
            res.json({"kq":0,"Lỗi xóa":err});
        }else{
            res.redirect("../list");
        }
    })
})