const path = require("path")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000

const Router = require("./routes/router.js")

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "dist/")))
app.use("/", Router)

app.listen(PORT, () => {
  console.log("🚀 Shipping on port 3000", process.env.NODE_ENV)
})