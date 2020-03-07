var express          = require("express"),
    bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    mongoose         = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    app              = express();
const port = 3000;
//APP Config
app.use(bodyParser.urlencoded({extended: true}));
// mongoose.set("useFindAndModify", false);
// mongoose.set("useUnifiedTopology", true);
// mongoose.set{"useNewUrlParser", true};
var url = process.env.DATABASEURL || "mongodb://localhost:27017/RestBlogApp";
mongoose.connect(url);
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine", "ejs");

//Mongodb Config
var BlogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type:Date, default:Date.now}
});
var Blog = mongoose.model("Blog",BlogSchema);
// Blog.create({
//   title: "Birds",
//   image: "https://images.unsplash.com/photo-1534700281814-9cfdb80f6d0c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
//   body: "This is Pictures of Birds sitting on the branch of trees"
// };
//Rest Routes
app.get("/",function(req,res){
  res.redirect("/blogs");
});
//Index
app.get("/blogs",function(req,res){
  Blog.find({},function(err,blogs){
    if(err){
      console.log("ERROR");
    } else {
        res.render("index",{blogs:blogs});
    }
  });
});
//New
app.get("/blogs/new",function(req,res){
    res.render("new");
});
//Create
app.post("/blogs",function(req, res){
      Blog.create(req.body.blog,function(err,newBlog){
        req.body.blog.body = req.sanitize(req.body.blog.body);
        if(err){
          console.log("Error");
          res.render("new");
        } else {
          res.redirect("/blogs");
        }
      });
});
//Show
app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id, function(err,foundBlog){
    if(err){
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.render("show",{blog: foundBlog});
    }
  });
});
//Edit
app.get("/blogs/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit",{blog:foundBlog});
    }
  });
});
//Update
app.put("/blogs/:id",function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/"+ req.params.id);
    }
  });
});
//Delete
app.delete("/blogs/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err){
    if (err) {
      res.redirect("/blogs");
    } else{
      res.redirect("/blogs");
    }
  });
});

app.listen(process.env.PORT,process.env.IP,function(req,res){
  console.log("Server has started at " + port);
});
