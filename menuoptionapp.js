//go through node tutorial again and replace all dininghall stuff with menuoptions stuff

import express from 'express';
import bodyParser from 'body-parser';
const MenuOption = require("./models/MenuOptions")
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
app.get('/menu-options/:station', async (req, res) => {
    //const menuoptions = await MenuOption.find().lean();
    const menuoptions = await MenuOption.find({ station: req.params.station})
    res.render('menuoptions-template', {
        layout : 'main',
        menuoptions: menuoptions,
        title: 'Menu Options',
        //dininghalls1: dininghalls
    });
});


// GET all TODO

const toJSONList = (mongoRecords) => {
    return JSON.parse(JSON.stringify(mongoRecords))
}

// GET all TODO
app.get('/api/v1/menu-options', async (req, res) => {
  const menuoptions = await MenuOption.find();
  res.status(200).send({
      success: 'true',
      message: 'Menu option retrieved successfully',
      menuoptions: menuoptions
  })
});

// POST a TODO
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
    // const menuoption = {
    //     id: menuoption_table.length + 1,
    //     item: req.body.item,
    //     ingredients: req.body.ingredients,
    //     dininghall: req.body.dininghall
    // }
    const menuoption = new MenuOption({
      item: req.body.item,
      ingredients: req.body.ingredients,
      dininghall: req.body.dininghall,
      station: req.body.station
    })
    await menuoption.save()
    //menuoption_table.push(menuoption);
    return res.status(201).send({
        success: 'true',
        message: 'Menu option added successfully',
        menuoption
    })
});

// GET a single TODO:
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

//     const id = parseInt(req.params.id, 10);
//     menuoption_table.map((menuoption) => {
//         if (menuoption.id === id) {
//             return res.status(200).send({
//             success: 'true',
//             message: 'Menu option retrieved successfully',
//             menuoption,
//             });
//         }
//     });
//     return res.status(404).send({
//         success: 'false',
//         message: 'Menu option does not exist',
//     });
});

// DELETE a TODO:
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

//     const id = parseInt(req.params.id, 10);
//
//     menuoption_table.map((menuoption, index) => {
//         if (menuoption.id === id) {
//             menuoption_table.splice(index, 1);
//             return res.status(200).send({
//                 success: 'true',
//                 message: 'Menu option deleted successfuly',
//             });
//         }
//     });
//
//     return res.status(404).send({
//         success: 'false',
//         message: 'Menu option not found',
//     });
//
});

// PUT (Update) a TODO:
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



      // const id = parseInt(req.params.id, 10);
      // let menuoptionFound;
      // let itemIndex;
      // menuoption_table.map((menuoption, index) => {
      //     if (menuoption.id === id) {
      //         menuoptionFound = menuoption;
      //         itemIndex = index;
      //     }
      // });

      // if (!menuoptionFound) {
      //     return res.status(404).send({
      //         success: 'false',
      //         message: 'Menu option not found',
      //     });
      // }
      //
      // if (!req.body.item) {
      //     return res.status(400).send({
      //         success: 'false',
      //         message: 'item is required',
      //     });
      // } else if (!req.body.ingredients) {
      //     return res.status(400).send({
      //         success: 'false',
      //         message: 'ingredients are required',
      //     });
      // }
      //
      // else if (!req.body.dininghall) {
      //     return res.status(400).send({
      //         success: 'false',
      //         message: 'dininghall is required',
      //     });
      // }
      //
      // const updatedMenuOptions = {
      //     id: menuoptionFound.id,
      //     title: req.body.item || menuoptionFound.item,
      //     hours: req.body.ingredients || menuoptionFound.ingredients,
      //     picture: req.body.dininghall || menuoptionFound.dininghall
      // };
    //menuoption_table.splice(itemIndex, 1, updatedMenuOptions);

    // return res.status(201).send({
    //     success: 'true',
    //     message: 'Menu option added successfully',
    //     menuoption,
    // });
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
