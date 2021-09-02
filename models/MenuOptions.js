const mongoose = require("mongoose")

//similar to a struct but for a dining hall
const menuoptionSchema = new mongoose.Schema({
  item: String,
  ingredients: String,
  dininghall: String,
  station: String
  //portion: String,
  //dietaryoptions: Array
});

//creating a variable using the struct we just created
const MenuOption = mongoose.model('menuoption', menuoptionSchema);
module.exports = MenuOption
