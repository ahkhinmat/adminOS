var express=require("express");
var app=express();

app.set("view engine","ejs");
app.set("views","./views");
app.use(express.static("public"));
app.listen(3000);
//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

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
          console.log("A Multer error occurred when uploading."); 
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
        }else{
            console.log("Upload is okay");
            console.log(req.file); // Thông tin file đã upload
            if(req.body.txtUn && req.body.txtPa){
                var un = req.body.txtUn;
                var pa = req.body.txtPa;
                res.json({"username":un, "password": pa, "file": req.file.filename});
            }else{
                res.json({"result":0});
            }
        }

    });
})