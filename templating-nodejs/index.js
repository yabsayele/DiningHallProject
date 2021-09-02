const express = require("express");
const app = express();

app.set("view engine", "ejs");
//app.use(express.static(path.join(__dirname, "public"))); //error: path not defined

app.get("/", (req, res) => {
  res.render("index"); //index refers to index.ejs
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
