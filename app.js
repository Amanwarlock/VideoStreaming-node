var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + "/views/";
var controller = require("./controllers/controller.js");
const port = 5000;
process.env.port = port;

router.use(function(req , res , next){
    console.log("/" , req.method);
    next();
});


router.get("/" , function(req , res){
    res.sendFile(path + "index.html");
});


router.get("/video/stream" , function(req , res){
    controller.v1_streamVideo(req , res);
});

app.use("/" , router);

app.use("*" , function(req, res){
    res.sendFile(path + "404.html");
});

app.listen(port , function(){
    console.log("Live at port " , port);
});