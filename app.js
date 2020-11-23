const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongo_url = process.env.URL;

mongoose.connect(""+mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.set("useCreateIndex", true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const resultSchema = new mongoose.Schema ({
  Name: String,
  RegistrationNo: String,
  Answer1: String,
  Answer2: String
});


var Result = new mongoose.model("Result", resultSchema);

app.post("/mcq",function(req,res){
    const submittedName = new Result(req.body);
    var marks = 0;
    submittedName.save()
    .then(item => {
        if(req.body.Answer1 == "Dessert Egale"){
            marks = marks +1;
        }
        if(req.body.Answer2 == "Smith & Wesson" ){
            marks = marks +1; 
        }
        
        res.render("answer", {
            Marksrecived: marks,
            yourans1: req.body.Answer1,
            yourans2: req.body.Answer2
        });
    })
    .catch(err => {
    res.render("mcq");
    });

});

app.get("/answer",function(req,res){
    res.render("answer");
});

app.get("/mcq",function(req,res){
    res.render("mcq");
});

app.get("/",function(req,res){
    res.render("index");
});

app.listen(3000,function(){
    console.log("Server on Port 3000 running")
});