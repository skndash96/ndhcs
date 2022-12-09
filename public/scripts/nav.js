window.addEventListener("load", main)

function main() {
  document.getElementById("loader")
    .classList.add("close")

  setTimeout(() => document.getElementById("loader").classList.add("hide"), 500)
  
  document.getElementById("navToggle")
    .addEventListener("click", () => toggleNav())
}

function toggleNav(close) {
  const nav = document.getElementById("nav")
  const navToggle = document.getElementById("navToggle")
  
  if (nav.classList.contains("open")) {
    nav.classList.remove("open")
    navToggle.innerHTML = "MENU"
  } else if (!close) {
    nav.classList.add("open")
    navToggle.innerHTML = "<span class=\"block mr-2 text-xl rotate-45 animate-[spin_150ms_ease-out_3]\">+</span>"
  }
}