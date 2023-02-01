const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //imports the static public folder.


//Variables
const auth = "Goose1";     // Enter Mongodb Auth here.


//Mongoose.
mongoose.connect("mongodb+srv://samarabp7:" + auth + "@cluster0.yp51xla.mongodb.net/todoList?retryWrites=true&w=majority");
                    //           username:auth                               Database

const itemsSchema = new mongoose.Schema({name: String});
const Item = mongoose.model("item", itemsSchema);


// Home.
app.get("/", function(req, res){

    Item.find({}, function(err, results) {
        if (err){
            console.log(err)
        } else {
            res.render("index", {items: results});
        }
    });
});

app.post("/", function(req, res){

    var tempItem = req.body.newItem;
    const itemToAdd = new Item({name: tempItem});

    Item.insertMany(itemToAdd, function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("Added to DB.");
        }
    });

    res.redirect("/");
});

app.post("/delete", function(req, res){
    const deleteId = req.body.checkbox;
    console.log(deleteId);
    Item.findByIdAndRemove(deleteId, function(err){
        if (err){
            console.log(err);
        } else {
            console.log("Deleted 1.");
        }
    });

    res.redirect("/");
});



app.listen(3000, function(){
    console.log("Server up on port 3000.");
});