/*
 Authors:
 Your name and student #: Zhe Zhang (Jerry) A01257572
 Your Partner's Name and student #: Zhaotong Jia (Joy) A00966936
 (Make sure you also specify on the Google Doc)
*/
const express = require("express");
const fs = require("fs").promises;

const movieDescription = "movieDescriptions.txt"
let movieDescriptionObj = {}
const myName = "Jerry"


let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let movieArray = []
let message = ""

app.get("/", (req, res) => res.render("pages/index", {movieArray, myName}));

app.get("/myForm", (req, res) => res.render("pages/myForm", {message}));

app.post("/myForm", (req, res) => {
    let formData = req.body
    movieArray = formData.movie.split(",")
    res.render("pages/index", {myName, movieArray: movieArray})
});

app.get("/myListQueryString", (req, res) => {
  let movie1 = req.query.movie1
  let movie2 = req.query.movie2
  if (movie1 === undefined || movie2 === undefined) {
    res.send("<p>Please enter 2 movies</p>")
  } else if (!(movieArray.includes(movie1))) {
    movieArray.push(movie1)
  } else if (!(movieArray.includes(movie2))) {
    movieArray.push(movie2)
  } else {
    res.send("<p>Please enter new movies")
  }
  res.render("pages/index", {myName, movieArray: movieArray})
});

app.get("/search/:movieName", (req, res) => {
  let movieName = req.params.movieName
  let movieNameAdjust = movieName[0].toUpperCase() + movieName.slice(1)
  fs.readFile(movieDescription)
  .then((data)=> {
    let movieDesArray = data.toString().split("\n")
    movieDesArray.forEach(element => {
      elementArray = element.split(":")
      movieDescriptionObj[elementArray[0]] = elementArray[1] 
    });
  })
  .then(()=> {
    if (Object.keys(movieDescriptionObj).includes(movieNameAdjust)) {
      res.render("pages/searchResult", {movieName: movieName, description: movieDescriptionObj[movieNameAdjust]})
    } else {
      res.send("Movie could not be found")
    }
  })
  .catch((err)=> rejects(err))
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});