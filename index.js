const path = require("path")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000

const Router = require("./routes/router.js")

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public/")))
app.use("/", Router)

app.listen(PORT, () => {
  console.log("🚀 Shipping on port 3000", proces.env.NODE_ENV)
})