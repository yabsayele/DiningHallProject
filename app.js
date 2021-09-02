import express from 'express';
import dininghall_table from './db/dininghalls';
import bodyParser from 'body-parser';
const DiningHall = require("./models/DiningHall")
const UserInfo = require("./models/UserInfo")
const MenuOption = require("./models/MenuOptions")
const path = require("path")
// Set up the express app
const app = express(); //27017

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dininghallapp', {useNewUrlParser: true});

const db = mongoose.connection; //our database is now coming from mongodb
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('public'))

const handlebars = require('express-handlebars');
//render HTML action_page with handlebars
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, '/public'))); //not running css
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views',
    extname: '.hbs'
}));

//////////////////////// RENDERING OUR HTML USING OUR TEMPLATES//////////////
//RENDER MAIN PAGE
app.get('/dining-halls', async (req, res) => {
    const dininghalls = await DiningHall.find().lean();
    res.render('alldininghalls-template', {
        layout : 'main',
        dininghalls: dininghalls
    });
});

// RENDER INDIVIDUAL DINING HALL PAGE
app.get('/dining-halls/:id', async (req, res) => {
  try {
    const dininghall = await DiningHall.findOne({ _id: req.params.id}).lean()
    res.render('dininghall-template', {
        layout : 'main',
        dininghall: dininghall
    });
  } catch (exception) {
    return res.status(404).send({
          success: 'false',
          message: 'dininghall doesnt exist: ' + req.params.id
      })
  }
});

// RENDER MENUOPTIONS FOR INDIVIDUAL STATIONS
app.get('/menu-options/:station', async (req, res) => {
    //const menuoptions = await MenuOption.find().lean();
    const menuoptions = await MenuOption.find({ station: req.params.station}).lean()
    res.render('menuoptions-template', {
        layout : 'main',
        menuoptions: menuoptions,
        title: 'Menu Options',
        //dininghalls1: dininghalls
    });
});

// // GET all TODO
// app.get('/dining-hall', async (req, res) => {
//     const dininghalls = await DiningHall.find().lean();
//     res.render('dininghall-template', {
//         layout : 'main',
//         dininghalls: dininghalls,
//         //title: 'Dining Halls',
//         //dininghalls1: dininghalls
//     });
// });

//////////////////////////////BACKEND RENDERING////////////////////
//SIGNUP POST
app.post("/signup", (req, res) => {
  //retreive the specifics of req.body
  const {username, mealplan, mealspecifications} = req.body;
  //put everything into a new element
  const userinfo = new UserInfo({
    username: req.body.username,
    mealplan: req.body.mealplan,
    mealspecifications: req.body.mealspecifications
  })
  //console.log(userinfo)
  //save it into our database but it isn't working here
  userinfo.save()
  res.redirect("/signup-complete?username="+username);
})
//RENDER CONFIRMATION PAGE
app.get('/signup-complete', async (req, res) => {
    res.render('confirmation', {
        layout : 'main',
        title: 'Confirmed Signup',
        username: req.query.username
    });
});
//LOG IN POST
app.post("/dining-halls", async (req, res) => {
  //retreive the specifics of req.body
  try{
    const {username, mealplan} = req.body;
    console.log(username, mealplan)
    const user =  await UserInfo.findOne({ username: username, mealplan: mealplan})

    res.status(201).send({
      success: 'true',
      message: 'user found',
      user: user
    })
  }catch (exception) {
    console.log(exception)
    res.status(404).send({
      success: 'false',
      message: 'user not found'

    })
  }
})

/////////////////////////////CRUD FOR DINING HALLS///////////////////////

const toJSONList = (mongoRecords) => {
    return JSON.parse(JSON.stringify(mongoRecords))
}

//GET ALL DINING HALLS
app.get('/api/v1/dining-halls', async (req, res) => {
  const dininghalls = await DiningHall.find();
  //res.render("index", {path: req.originalUrl })
  res.status(200).send({
      success: 'true',
      message: 'dininghall retrieved successfully',
      dininghalls: dininghalls
  })
});

// POST ONE DINING HALL
app.post('/api/v1/dining-halls', async (req, res) => {
  console.log(req.body);
    if(!req.body.name) {
        return res.status(400).send({
            success: 'false',
            message: 'name is required'
        });
    } else if(!req.body.picture) {
        return res.status(400).send({
            success: 'false',
            message: 'picture is required'
        });
    }else if(!req.body.hours) {
        return res.status(400).send({
            success: 'false',
            message: 'hours are required'
        });
    }else if(!req.body.station) {
        return res.status(400).send({
            success: 'false',
            message: 'station are required'
        });
      }

    const dininghall = new DiningHall ({
        name: req.body.name,
        hours: req.body.hours,
        picture: req.body.picture,
    })

    await dininghall.save() //save into database
    return res.status(201).send({
        success: 'true',
        message: 'dininghall added successfully',
        dininghall
    })
});

// GET ONE DINING HALL
app.get('/api/v1/dining-halls/:id', async (req, res) => {

  try {
    const dininghall = await DiningHall.findOne({ _id: req.params.id})
    res.send(dininghall)
  } catch (exception) {
    return res.status(404).send({
          success: 'false',
          message: 'dininghall doesnt exist: ' + req.params.id
      })
  }
})

// DELETE ONE DINING HALL
app.delete('/api/v1/dining-halls/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const dininghall = DiningHall.findOne({ _id: req.params.id})

	await DiningHall.deleteOne({ _id: req.params.id })
  if (dininghall.id === id) {
    return res.status(200).send({
          success: 'true',
          message: 'dininghall deleted successfuly',
      });
    } else {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
});

// PUT/Patch ONE DINING HALL
app.patch('/api/v1/dining-halls/:id', async (req, res) => {
  console.log(req.params.id)
  try {
    const dininghall = await DiningHall.findOne({ _id: req.params.id })
  } catch (exception){
    return res.status(404).send({
            success: 'false',
            message: 'dininghall not found',
        });
  }
  if (req.body.name) {
      dininghall.name = req.body.name
  }

  if (req.body.hours) {
  dininghall.hours = req.body.hours
  }

  if (req.body.picture) {
    dininghall.picture = req.body.picture
  }
  if (req.body.station) {
    dininghall.station = req.body.station
  }
  await dininghall.save()
  res.send(dininghall)
});

//////////////////////////CRUD FOR MENU OPTIONS/////////////////////////////

// GET ALL MENU OPTIONS
app.get('/api/v1/menu-options', async (req, res) => {
  const menuoptions = await MenuOption.find();
  res.status(200).send({
      success: 'true',
      message: 'Menu option retrieved successfully',
      menuoptions: menuoptions
  })
});

// POST ONE MENU OPTION
app.post('/api/v1/menu-options', async (req, res) => {
  console.log(req.body);
    if(!req.body.item) {
        return res.status(400).send({
            success: 'false',
            message: 'item is required'
        });
    } else if(!req.body.ingredients) {
        return res.status(400).send({
            success: 'false',
            message: 'ingredients is required'
        });
    }
    else if(!req.body.dininghall) {
        return res.status(400).send({
            success: 'false',
            message: 'dininghall are required'
        });
    }
    const menuoption = new MenuOption({
      item: req.body.item,
      ingredients: req.body.ingredients,
      dininghall: req.body.dininghall,
      station: req.body.station
    })
    await menuoption.save()
    return res.status(201).send({
        success: 'true',
        message: 'Menu option added successfully',
        menuoption
    })
});

// GET ONE MENU OPTION
app.get('/api/v1/menu-options/:id', async (req, res) => {

    try {
      const menuoption = await MenuOption.findOne({ _id: req.params.id})
      res.send(menuoption)
    } catch (exception) {
      return res.status(404).send({
        success: 'false',
        message: 'Menu option doesnt exist: ' + req.params.id
      });
    }
});

// DELETE ONE MENU OPTION
app.delete('/api/v1/menu-options/:id', async (req, res) => {
  try {
    const menuoption = await MenuOption.findOne({ _id: req.params.id})
    await MenuOption.deleteOne({ _id: req.params.id})
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

// PUT/PATCH ONE MENU OPTION
app.patch('/api/v1/menu-options/:id', async (req, res) => {
  console.log(req.params.id)
  try {
    const menuoption = await MenuOption.findOne({ _id: req.params.id})
    console.log(menuoption)

    if (req.body.item){
      menuoption.item = req.body.item
    }
    if (req.body.ingredients) {
      menuoption.ingredients = req.body.ingredients
    }
    if (req.body.dininghall) {
      menuoption.dininghall = req.body.dininghall
    }
    if (req.body.station) {
      menuoption.station = req.body.station
    }
    await menuoption.save()
    res.send(menuoption)
  } catch (exception) {
    return res.status(404).send({
      success: 'false',
      message: 'Menu option doesnt exist' + req.params.id
    });
  }
});

/////////////////////////CRUD FOR USER INFOS///////////////////////////////

// GET ALL USER INFO
app.get('/api/v1/user-infos', async (req, res) => {
  const userinfos = await UserInfo.find()
  res.status(200).send({
      success: 'true',
      message: 'User Infomations retrieved successfully',
      menuoptions: userinfos
  })
});

// POST ONE USER INFO
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
    return res.status(201).send({
        success: 'true',
        message: 'User Information added successfully',
        userinfo
    })
});

// GET ONE USER INFO
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

// DELETE ONE USER INFO
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

// PUT/PATCH ONE USER INFO
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
});
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
