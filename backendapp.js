const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const UserInfo = require("./models/UserInfo")
//const axios = require("axios")///what is this?


// Set up the express app
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/dininghallapp", {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //we're connected!
});

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('public'))

const handlebars = require("express-handlebars");
//render HTML page with handlebars

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "/public")));
app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views',
  extname: '.hbs'
}));

app.get("/backend", (req,res) => {
  res.render('backendform', {
      layout : 'main',
      title: 'User Info'
  });
})

app.post("/backend", async (req, res) => {
  //retreive the specifics of req.body
  const {username, mealplan, mealspecifications} = req.body;
  console.log(req.body)
  //put everything into a new element
  //how do I connect it to the database?
  const userinfo = new UserInfo({
    username: req.body.username,
    mealplan: req.body.mealplan,
    mealspecifications: req.body.mealspecifications
  })
  //save it into our database
  await userinfo.save()

  //do i want to render a new website/template?
  // res.render('backendsuccess-template', {
  //     layout : 'main',
  //     username: username,
  //     mealplan: mealplan,
  //     mealspecifications: mealspecifications,
  //     title: 'User Info',
  //     //dininghalls1: dininghalls
  // });
})

app.get("/backend/:id", async (req,res) => {
  try{
    const user =  await UserInfo.findOne({ _id:req.params.id}).lean()

    res.render('backendform', {
        layout : 'main',
        title: 'User Info',
        user: user
    });
  }catch (exception) {
    console.log(exception)
    res.render('backendform', {
        layout : 'main',
        title: 'User Info'
    });
  }
})

app.post("/backend/:id", async (req, res) => {
  //retreive the specifics of req.body
  console.log("put:" + req.params.id)
  try{
    let user =  await UserInfo.findOne({ _id:req.params.id})

    user.username = req.body.username;
    user.mealplan = req.body.mealplan;
    user.mealspecifications = req.body.mealspecifications;

    user.save();

    user =  await UserInfo.findOne({ _id:req.params.id}).lean()
    res.render('backendform', {
        layout : 'main',
        title: 'User Info',
        user: user,
        message: "Success!"
    });
  }catch (exception) {
    console.log(exception)
    res.status(404).send({
      success: 'false',
      message: 'user not successfuly updated'

    })
  }
})

// PUT (Update) a TODO:
// app.put('/backend', async (req, res) => {
//
//   console.log(req.body)
//   const userinfo = await UserInfo.findOne({ _id: req.body.id})
//   console.log(userinfo)
  // try {
  //   const userinfo = await UserInfo.findOne({ _id: req.body.id})
  //   console.log(userinfo)
  //
  //   if (req.body.username){
  //     userinfo.username = req.body.username
  //   }
  //   if (req.body.mealplan) {
  //     userinfo.mealplan = req.body.mealplan
  //   }
  //   if (req.body.mealspecifications) {
  //     userinfo.mealspecifications = req.body.mealspecifications
  //   }
  //   await userinfo.save()
  //   res.send(userinfo)
  // } catch (exception) {
  //   return res.status(404).send();
  // }
 //})

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
