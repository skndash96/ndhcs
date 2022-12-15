const path = require("path")
const fs = require("fs")
const express = require("express")
const Router = express.Router()
const files = fs.readdirSync(path.join(__dirname, "../views"))
                           
for (let file of files) {
  Router.get(
    `/${file.split(".")[0]}`, (req, res) => {
    res.render(
      path.join(__dirname, `../views/${file}`),
      { page: file },
      (e, html) => {
        if (e) {
          console.error(e)
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