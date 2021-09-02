const mongoose = require("mongoose")

//similar to a struct but for a dining hall
const dininghallSchema = new mongoose.Schema({
  name: String,
  hours: String,
  picture: String,
  station: Array,
  //address: String,
  //coordinates: Array
});

//creating a variable using the struct we just created
const DiningHall = mongoose.model('diningHall', dininghallSchema);
module.exports = DiningHall

// const sargent = new DiningHall({
//   name: 'Sargent',
//   hours: '8am-10pm',
//   picture: 'sarge',
//   address: '123',
//   coordinates: ['12344', '124234']
// });
// console.log(sargent.name); // 'Silence'
//
// sargent.save(function (err, sargent) {
//     if (err) return console.error(err);
//   });
//
// const elder = new DiningHall({
//   name: 'Elder',
//   hours: '8am-8pm',
//   picture: 'elderr',
//   address: '123456',
//   coordinates: ['123', '1234']
// });
// console.log(elder.name); // 'Silence'
//
// elder.save(function (err, elder) {
//     if (err) return console.error(err);
//   });
