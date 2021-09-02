import express from 'express';
import dininghall_table from './db/dininghalls';
import bodyParser from 'body-parser';
const SelectedItem = require("./models/SelectedItem")
const path = require("path")


// Set up the express app
const app = express(); //27017

// mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb

// getting-started.js
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
//render HTML action_page with ejs
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, '/public'))); //not running css
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views',
    extname: '.hbs'
}));

// GET all TODO
app.get('/pickup-order', async (req, res) => {
    const selecteditems = await SelectedItem.find().lean();
    res.render('pickuporder-template', {
        layout : 'main',
        pickuporder: selecteditems,
        //title: 'Dining Halls',
        //dininghalls1: dininghalls
    });
});
