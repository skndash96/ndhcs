window.addEventListener("load", () => {
  document.getElementById("loader")?.classList.add("close")

  setTimeout(() => document.getElementById("loader")?.remove(), 500)
  
  document.getElementById("navToggle")
    .addEventListener("click", () => toggleNav())

  const mapEl = document.createElement("iframe")
  mapEl.className = "w-full h-full"
  mapEl.src = "https://maps.google.com/maps?q=notre%20dame%20Salem&t=k&z=13&ie=UTF8&iwloc=&output=embed"
  mapEl.loading = "lazy"
  mapEl.frameborder = "0"
  mapEl.marginheight = "0"
  mapEl.marginwidth = "0"
  document.getElementById("mapEmbed").replaceChildren(mapEl)
})

function toggleNav(close) {
  const nav = document.getElementById("nav")
  const navToggle = document.getElementById("navToggle")
  
  if (nav.classList.contains("open")) {
    nav.classList.remove("open")
    navToggle.innerHTML = "MENU"
  } else if (!close) {
    nav.classList.add("open")
    navToggle.innerHTML = "<span class=\"block mr-2 text-xl rotate-45 animate-[scaleSpin_200ms_ease-in_1]\">+</span>"
  }
}