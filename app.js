
var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    flash       =  require("connect-flash"),
    passport    = require("passport"),
    methodOverride=require("method-override"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user")
    // seedDB      = require("./seeds")
  
    const env=require('dotenv');
    env.config();
    

const url=process.env.MONGODB_URL;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


    app.use(express.urlencoded({extended: true}));
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));
    app.use(methodOverride('_method'));
    app.use(flash());
    // seedDB();
    
    
    app.locals.moment = require('moment-timezone');
    
    // PASSPORT CONFIGURATION
    app.use(require("express-session")({
        secret: "mkknnjbn!",
        resave: false ,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    app.use(function(req, res, next){
       res.locals.currentUser = req.user;
       res.locals.error=req.flash("error");
       res.locals.success=req.flash("success");
       next();
    });
       
//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port=process.env.PORT || 3000;
app.listen(port,function(){
   console.log("The YelpCamp Server Has Started!");
});

