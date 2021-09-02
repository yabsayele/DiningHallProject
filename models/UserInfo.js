const mongoose = require("mongoose")

//similar to a struct but for a dining hall
const userinfoSchema = new mongoose.Schema({
  username: String,
  mealplan: String,
  mealspecifications: String
});

//creating a variable using the struct we just created
const UserInfo = mongoose.model('userinfo', userinfoSchema);
module.exports = UserInfo
