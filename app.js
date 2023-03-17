const express=require("express");
const bodyParser = require("body-parser");
const date=require(__dirname +"/date.js");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine' ,'ejs');
const  items=["Win", "Victory", "Work Hard", "Celebrate"];
const  workItems=[];
app.get("/",function(req,res){
    const  day=date.getDate();
    
    res.render("list", {listTitle:day, newTodo:items});

    
});
app.post("/",function(req,res){
    //console.log(req.body);
    if(req.body.button==="Work")
     {workItems.push(req.body.newItem);
        res.redirect("/work");
     }
    else 
     {items.push(req.body.newItem);
     res.redirect("/");
     }

});
app.get("/work",function(req,res){
    
    res.render("list",{listTitle:"Work List",newTodo:workItems});
});
app.post("/work",function(req,res){
    
    workItems.push(req.body.newItem);
    
    res.redirect("/" + req.body.button);

});
app.get("/about",function(req,res){
    res.render("about");
})


app.listen(4000,function(){
    console.log("Server is running on port 4000");
});
