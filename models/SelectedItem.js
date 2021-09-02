const mongoose = require("mongoose")

//similar to a struct but for a dining hall
const selecteditemSchema = new mongoose.Schema({
  item: String,
  ingredients: String,
  dininghall: String,
  station: String
  //portion: String,
  //dietaryoptions: Array
});

//creating a variable using the struct we just created
const SelectedItem = mongoose.model('selecteditem', selecteditemSchema);
module.exports = SelectedItem
