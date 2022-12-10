const path = require("path")
const fs = require("fs")
const express = require("express")
const Router = express.Router()

const files = fs.readdirSync(path.join(__dirname, "../views"))

const events = fs.readdirSync(path.join(__dirname, "../public/gallery"))
  .map(dir => ([
    dir.split("_").map(w => w[0].toUpperCase() + w.substring(1)).join(" "),
    fs.readdirSync(path.join(__dirname, `../public/gallery/${dir}`)).map(f => `gallery/${dir}/${f}`)
  ]))
const news = ([
  { time: new Date(), name: "Annual Day Circular", link: "" },
  { time: new Date(2022, 10, 2), name: "Math Bee Winners", link: "" },
  { time: new Date(2022, 9, 27), name: "PTA Meeting 4 2022", link: "" },
  { time: new Date(2022, 9, 19), name: "Essay Writing Competition Topics", link: "" },
  { time: new Date(2022, 9, 1), name: "Fancy Dress Circular", link: "" },
  { time: new Date(2022, 8, 22), name: "Kalothsav Information", link: "" },
  { time: new Date(2022, 8, 21), name: "Diwali Celeberation", link: "" },
  { time: new Date(2022, 9, 19), name: "Sahodaya Football", link: "" }
])
                           
for (let file of files) {
  Router.get(
    `/${file.split(".")[0]}`, (req, res) => {
    res.render(
      path.join(__dirname, `../views/${file}`),
      {
        page: file,
        news,
        events
      },
      function (err, html) {
        if (err) {
          console.error(err)
          res.redirect("/500")
         }
        else res.send(html)
      }
    )
  })
}

Router.get("/", (req, res) => {
  res.redirect("/home")
})

Router.get("/*", (req, res) => {
  res.redirect("/404")
})

module.exports = Router