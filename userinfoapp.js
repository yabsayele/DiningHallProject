//go through node tutorial again and replace all dininghall stuff with menuoptions stuff

import express from 'express';
import userinfo_table from './db/userinfos';
import bodyParser from 'body-parser';
const UserInfo = require("./models/UserInfo")
const path = require("path")

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

// GET all TODO in a template
app.get('/user-infos', async (req, res) => {
    const userinfos = await UserInfo.find().lean();
    res.render('userinfos-template', {
        layout : 'main',
        userinfos: userinfos,
        title: 'User Info',
        //dininghalls1: dininghalls
    });
});

// GET all TODO

const toJSONList = (mongoRecords) => {
    return JSON.parse(JSON.stringify(mongoRecords))
}


// GET all TODO
app.get('/api/v1/user-infos', async (req, res) => {

  const userinfos = await UserInfo.find()
  res.status(200).send({
      success: 'true',
      message: 'User Infomations retrieved successfully',
      menuoptions: userinfos
  })
});

// POST a TODO
app.post('/api/v1/user-infos', async (req, res) => {
  console.log(req.body);
    if(!req.body.username) {
        return res.status(400).send({
            success: 'false',
            message: 'name is required'
        });
    } else if(!req.body.mealplan) {
        return res.status(400).send({
            success: 'false',
            message: 'meal plan is required'
        });
    }
    else if(!req.body.mealspecifications) {
        return res.status(400).send({
            success: 'false',
            message: 'meal specifications is required'
        });
    }

    const userinfo = new UserInfo({
      username: req.body.username,
      mealplan: req.body.mealplan,
      mealspecifications: req.body.mealspecifications
    })
    await userinfo.save()
    //menuoption_table.push(menuoption);
    return res.status(201).send({
        success: 'true',
        message: 'User Information added successfully',
        userinfo
    })
});

// GET a single TODO:
app.get('/api/v1/user-infos/:id', async (req, res) => {
  try{
    const userinfo = await UserInfo.findOne({ _id: req.params.id})
    res.status(200).send({
        success: 'true',
        message: 'User Infomations retrieved successfully',
        menuoptions: userinfo
    })
  }catch (exception){
    return res.status(404).send({
        success: 'false',
        message: 'userinfo does not exist: ' + req.params.id,
    });
  }
});

// DELETE a TODO:
app.delete('/api/v1/user-infos/:id', async (req, res) => {

  try {

    await UserInfo.deleteOne({ _id: req.params.id})
    return res.status(404).send({
      success: 'true',
      message: 'Menu option deleted successfully' + req.params.id
    });
  } catch (exception) {
    return res.status(404).send({
      success: 'false',
      message: 'Menu option doesnt exist' + req.params.id
    });
  }

});

// PUT (Update) a TODO:
app.patch('/api/v1/user-infos/:id', async (req, res) => {

  console.log(req.params.id)
  try {
    const userinfo = await UserInfo.findOne({ _id: req.params.id})
    console.log(userinfo)

    if (req.body.username){
      userinfo.username = req.body.username
    }
    if (req.body.mealplan) {
      userinfo.mealplan = req.body.mealplan
    }
    if (req.body.mealspecifications) {
      userinfo.mealspecifications = req.body.mealspecifications
    }
    await userinfo.save()
    res.send(userinfo)
  } catch (exception) {
    return res.status(404).send({
      success: 'false',
      message: 'user info doesnt exist: ' + req.params.id
    });
  }

    // if (!userinfoFound) {
    //     return res.status(404).send({
    //         success: 'false',
    //         message: 'userinfo not found',
    //     });
    // }
    //
    // if (!req.body.username) {
    //     return res.status(400).send({
    //         success: 'false',
    //         message: 'username is required',
    //     });
    // } else if (!req.body.mealplan) {
    //     return res.status(400).send({
    //         success: 'false',
    //         message: 'mealplan are required',
    //     });
    // }
    //
    // else if (!req.body.mealspecifications) {
    //     return res.status(400).send({
    //         success: 'false',
    //         message: 'mealspecifications is required',
    //     });
    // }


});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
