window.addEventListener("load", main)

function main() {
  document.getElementById("navToggle")
  .addEventListener("click", function (e) {
    const nav = document.getElementById("nav")
    const navToggle = document.getElementById("navToggle")
    
    if (nav.classList.contains("open")) {
      nav.classList.remove("open")
      navToggle.innerHTML = "MENU"
    } else {
      nav.classList.add("open")
      navToggle.innerHTML = "<span class=\"block text-xl rotate-45\">+</span>"
    }
  })
}
  