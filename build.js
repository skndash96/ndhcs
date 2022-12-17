const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")
const ejs = require("ejs")

let start = Date.now()

let files = fs.readdirSync("views").filter(f => f.endsWith(".ejs"))
for(let i = 0; i < files.length; i++) {
  let f = files[i]
  let inp = "./views/"+f
  let out = "dist/"+f.slice(0,-3)+"html"
  
  ejs.renderFile(inp, null, {rmWhitespace: true}, write)
  function write(e, html) {
    if (e) return console.error(e)
    
    fs.writeFileSync(out, html, "utf-8")
    console.log("Completed "+out)
  }
}

console.log("Done in "+(Date.now()-start)+"ms")