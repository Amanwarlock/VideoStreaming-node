"use strict;"
var http = require("http");
var fs = require("fs");
var path = require("path");

/* function streamVideo(req , res){
    var vidUrl = "assets/vid/human.mp4";
    var stream = fs.createReadStream(vidUrl);
    var file = "";
    stream.on('data' , chunk =>{
        console.log("----Received chunk----");
        file += chunk;
    });

    stream.on('end' , ()=>{
        console.log("---Read stream ended---");
       // res.writeHead(200, 'Success');
        res.end();
    });

    stream.on('error' , ()=>{
        res.writeHead(404 , 'Not Found');
        res.end();
    });

    stream.pipe(res);
} */


/*
HTTP type used for buffering is called HTTP 206;
https://medium.com/@daspinola/video-stream-with-node-js-and-html5-320b3191a6b6 
 */
function streamVideo(req, res) {
    console.log("Inside stream video function.........");
    const filePath = 'assets/human.mp4';
    const stat = fs.statSync(filePath);
    let fileSize = stat.size;
    let range = req.headers.range;
    if (range) {
        // Range: bytes= 0-;
        var parts = range.replace(/bytes=/, "").split("-");
        var start = parseInt(parts[0], 10);
        var end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);

    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(filePath).pipe(res)
    }

}

module.exports = {
    v1_streamVideo: streamVideo
};