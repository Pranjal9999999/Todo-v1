const express=require("express");
const bodyParser = require("body-parser");
const date=require(__dirname +"/date.js");
const _=require("lodash");
const app=express();
const mongoose=require("mongoose");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine' ,'ejs');
//const  items=["Win", "Victory", "Work Hard", "Celebrate"];
const  workItems=[];
mongoose.connect("mongodb://127.0.0.1:27017/todoListDB");
const itemsSchema={
    name:{type:String,required:true}
}
const Item=mongoose.model('Item',itemsSchema);
const item1=new Item({name:"Work Hard"});
const item2=new Item({name:"WIN"});
const item3=new Item({name:"Celebrate"});

const defaultItems=[item1,item2,item3];
const listSchema={
    name:String,
    items:[itemsSchema]
};
const List=mongoose.model('List',listSchema);



app.get("/",function(req,res){
    const  day=date.getDate();
      
Item.find()
.then(function (items) {
    if(items.length==0){
        Item.insertMany(defaultItems)
        .catch(function(err){
            console.log(err);
        });
    }
    res.render("list", {listTitle:day, newTodo:items});

})
.catch(function (err) {
console.log(err);
});
    
    
    
});
app.post("/",function(req,res){
    
    const newItemName=req.body.newItem;
    const listName=req.body.list;
    const newItem=new Item({name:newItemName});
    if(listName==date.getDate()){
       
            
            newItem.save();
            res.redirect("/");
            

    }
    else{
        List.findOne({name:listName})
        .then(function(list){
          console.log(list);
          list.items.push(newItem);
          list.save();
          res.redirect("/"+listName);
        })
        .catch(function(err){
            console.log(err);
        });
    }
    

});
app.get("/:newList",function(req,res){
    const customListName=_.capitalize(req.params.newList);
    List.findOne({name:customListName})
    .then(function(result){
        //console.log(result);
        if(result){
            console.log("Custom list exits");
            res.render("list",{listTitle:result.name,newTodo:result.items});
        }
        else
         {console.log("The custom list does not exist");
         const list=new List({name:customListName, items:defaultItems});
         list.save(); 
         res.redirect("/"+ customListName);
         }
    })
    .catch(function(err){
        console.log(err);
    });
    

})
app.get("/about",function(req,res){
    res.render("about");
});
app.post("/delete",function(req,res){
   const checkedItemId=req.body.checkbox;
   const listName=req.body.listName;
   if(listName==date.getDate()){
    Item.findByIdAndDelete(checkedItemId)
    .catch(function(err){
     console.log(err);
    });
    res.redirect("/");
  }
 else{
    List.findOneAndUpdate({name:listName},{$pull :{items :{ _id:checkedItemId}}})
    .then(function(result){
       
         
        res.redirect("/"+listName);
             
        })
    .catch(function(err){
        console.log(err);
    });

 }

});


app.listen(4000,function(){
    console.log("Server is running on port 4000");
});
