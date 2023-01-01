import { db, collection, getDocs, query, limit, orderBy } from "./firebase.js"

export default function loadNews(showMany = true, force = false) {
  const newsEl = document.getElementById("news")
  const spinner = newsEl.firstElementChild
  
  const expTime = 1*60*60*1000

  const news = JSON.parse(localStorage["news"] || null)
  
  if (!force && news && news[0] > Date.now()) {
    writeNews(news.slice(1))
    spinner.classList.add("hidden")
  }
  else {
    getDocs(query(collection(db, "news"), orderBy("date", "desc"), limit(showMany ? 20 : 10)))
    .then(docs => {
      const news = [Date.now() + expTime]
      docs.forEach(doc => news.push(doc.data()))
      localStorage["news"] = JSON.stringify(news)
      writeNews(news.slice(1))
      spinner.classList.add("hidden")
    })
    .catch(e => {
      console.error(e)
      spinner.innerHTML = "Try again later"
    })
  }

  function writeNews(docs) {
    while (newsEl.children.length > 1) {
      newsEl.removeChild(newsEl.lastElementChild)
    }
    
    const moreEl = document.createElement("button")
    moreEl.className = "underline md:col-span-2 text-center text-blue-600"
    moreEl.textContent = "Load more"
    moreEl.onclick = e => {
      let els = e.target.parentElement.querySelectorAll(".mmh")
      for (let i=0; i < els.length; i++) {
        els[i].classList.remove("max-md:hidden")
      }
      if (!els.length) {
        e.target.textContent = "No further Items."
        e.target.disabled = true
        e.target.classList.remove("underline")
      } else e.target.remove()
    }
    
    newsEl.append(...docs.map(({title,date,url}, i) => {
      date = new Date(date.seconds*1000)
      let el = document.createElement("div")
      el.className = `${(showMany && i > 9) || (!showMany && i > 3) ? "mmh max-md:hidden " : "" }${!showMany && i > 11 ? "md:hidden " : ""}block relative flex gap-4 items-center items-stretch shadow-sm bg-gray-50 hover:shadow-md`
      el.innerHTML = `
        <div class="inline-block p-2 text-center bg-blue-400 text-gray-50">
          <h2 class="font-['Courier'] font-black">
            ${("0"+date.getDate().toString()).slice(-2)}
          </h2>
          <h4 class="font-black">
            ${date.toLocaleString("default", { month: "short"})}
          </h4>
        </div>
        <div class="p-2 pl-1 w-full">
          <h4 class="">
            ${title}
          </h4>`+
          (url ? `<div class="w-fit ml-auto">
          <a href="${url}" class="p-1 dl inline-block rounded-sm bg-sky-600 text-gray-50"><i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg></i></a>
          <a target="_blank" rel="nofollow" href="/pdf?url=${encodeURIComponent(url)}" class="ml-2 p-1 rounded-sm bg-sky-600 text-gray-50"><i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg></i></a>
          </div>` : "")+
        "</div>"

      el.querySelector(".dl").onclick = () => el.querySelector(".dl").classList.add("bg-green-700")
      return el
    }), moreEl)
  }
}