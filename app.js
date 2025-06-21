const express = require('express')
const app = express()
const path  =require('path')
const fs = require('fs')

app.set("view engine" , "ejs")
app.use(express.json())
app.use(express.urlencoded({extended :true}))
app.use(express.static(path.join(__dirname , "public")))

app.get('https://vikrantan5.github.io/khatabook2/' , function(req , res){
    fs.readdir(`./hisaab` , function(err , files){
        if(err) return res.status(500).send(err)
        res.render("index" , {files:files})

    })
})


app.get('/create' , function(req , res){
    res.render("create")

})

app.get("/edit/:filename" , function(req , res){
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8" , function(err , data){
        if(err) res.status(500).send(err)
         res.render("edit" ,{data: data , filename:req.params.filename})

    })
   

})

app.get("/hisaab/:filename" , function(req , res){
     fs.readFile(`./hisaab/${req.params.filename}`,"utf-8" , function(err , data){
        if(err) res.status(500).send(err)
        res.render("hisaab" , {data:data,file:req.params.filename})

    })
    
})



app.get('/delete/:filename' , function(req  ,res){
    fs.unlink(`./hisaab/${req.params.filename}` , function(err){
        if(err) res.status(500).send(err)
        res.redirect('https://vikrantan5.github.io/khatabook2/')
    })
} )


app.post("/update/:filename" , function(req , res){
    fs.writeFile(`./hisaab/${req.params.filename}` , req.body.content , function(err){
        if(err) res.status(500).send(err)
            res.redirect('https://vikrantan5.github.io/khatabook2/')
    })
})


app.post("/createhisaab", function (req, res) {
  var currentDate = new Date();
  var day = String(currentDate.getDate()).padStart(2, "0");
  var month = String(currentDate.getMonth() + 1).padStart(2, "0");
  var year = currentDate.getFullYear();

  var date = `${day}-${month}-${year}`;
  var basePath = `./hisaab/${date}.txt`;

  fs.stat(basePath, function (err) {
    if (err) {
      // File doesn't exist — create it directly
      fs.writeFile(basePath, `${req.body.content}`, function (err) {
        if (err) return res.status(500).send(err);
        res.redirect("https://vikrantan5.github.io/khatabook2/");
      });
    } else {
      // File exists — check for next available filename
      let counter = 2;

      function tryNextFile() {
        let newPath = `./hisaab/${date}(${counter}).txt`;

        fs.stat(newPath, function (err) {
          if (err) {
            // File with this name doesn't exist — create it
            fs.writeFile(newPath, `${req.body.content}`, function (err) {
              if (err) return res.status(500).send(err);
              res.redirect("https://vikrantan5.github.io/khatabook2/");
            });
          } else {
            // File exists — try next number
            counter++;
            tryNextFile();
          }
        });
      }

     tryNextFile();
    }
  });
});





app.listen(3000)
