const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //imports the static public folder.


//Variables
const auth = "Goose1";     // Enter Mongodb Auth here.

const item1 = {name: "Welcome to your list!"};
const item2 = {name: "Please add items below."}
const defaultItems = [item1, item2];


//Mongoose.
mongoose.connect("mongodb+srv://samarabp7:" + auth + "@cluster0.yp51xla.mongodb.net/todoList?retryWrites=true&w=majority");
                    //           username:auth                                       Database

const itemsSchema = new mongoose.Schema({name: String});
const listsSchema = new mongoose.Schema({
    name : String,
    items : [itemsSchema]
});

const Item = mongoose.model("item", itemsSchema);
const List = mongoose.model("list", listsSchema);


// Home.
app.get("/", function(req, res){

    Item.find({}, function(err, results) {
        if (err){
            console.log(err)
        } else {
            // res.render("index", {items: results});
            res.render("index", {listTitle : "Today", items : results});
        }
    });
});

//Custom routing.
app.get("/:customListName", function(req, res){

    const customList = req.params.customListName;
    List.findOne({name : customList}, function(err, results){
        if (!err){
            if (!results){
                console.log("entered making new custom list.");
                //Create new list.
                const list = new List({
                    name : customList,
                    items : defaultItems
                });
            
                list.save();
                res.redirect("/" + customList);

            } else {

                //Display existing list.
                res.render("index", {listTitle : results.name, items : results.items});
            }
        }
    });
});



//Adds items.
app.post("/", function(req, res){

    var tempItem = req.body.newItem;
    const itemToAdd = new Item({name: tempItem});
    const listName = req.body.button;

    console.log(listName);

    if (listName == "Today"){

        // saves root route.
        itemToAdd.save();
        res.redirect("/");

    } else {

        // Saves to custom route.
        List.findOne({name : listName}, async function(err, results){
            if (err){
                console.log(err);
            } else {
                results.items.push(itemToAdd);
                const done = await results.save();

                if (done === results){  // Checking if the database looks like the data I just sent it.
                    res.redirect("/" + listName); 
                } else {
                    console.log("ERROR with await.");
                }
            }
        });
    }
});

//Removes items.
app.post("/delete", function(req, res){
    const deleteId = req.body.checkbox;

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