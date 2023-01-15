const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //imports the static public folder.

var items = [];


app.get("/", function(req, res){

    res.render("index", {items: items});
});





app.post("/", function(req, res){

    var item = req.body.newItem;
    items.push(item);

    res.redirect("/");
});





app.listen(3000, function(){
    console.log("Server up on port 3000.");
});