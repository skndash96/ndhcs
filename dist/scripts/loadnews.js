function loadNews(db, storage, showMany = true, force = false) {
  const newsEl = document.getElementById("news")
  const spinner = newsEl.firstElementChild
  
  const expTime = 1*60*60*1000

  const news = JSON.parse(localStorage["news"] || null)
  if (!force && news && news[0] > Date.now()) {
    writeNews(news.slice(1))
    spinner.classList.add("hidden")
  }
  else if ((force && news) ? (news[0]-Date.now() < expTime-5*60*1000) : true) {
    db.collection("news").orderBy("date", "desc").limit(showMany ? 20 : 10).get()
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
  else {
    setTimeout(() => spinner.classList.add("hidden"), 500)
  }

  function writeNews(docs) {
    while (newsEl.childNodes.length > 1) {
      newsEl.removeChild(newsEl.lastChild)
    }
    
    newsEl.append(...docs.map(({title,date,url}, i) => {
      date = new Date(date.seconds*1000)
      
      let el = document.createElement("a")
      el.href = "/pdf?url="+encodeURIComponent(url)
      el.target = "_blank"
      el.className = `${(showMany ? i > 9 : i > 3) ? "max-md:hidden " : ""}block relative flex gap-4 items-center shadow-sm bg-gray-50 hover:shadow-md hover:bg-slate-300`
      el.innerHTML = `
        <div class="inline-block p-2 text-center bg-blue-400 text-gray-50">
          <h2 class="font-['Courier'] font-black">
            ${("0"+date.getDate().toString()).slice(-2)}
          </h2>
          <h4 class="font-black">
            ${date.toLocaleString("default", { month: "short"})}
          </h4>
        </div>
        <h4 class="px-1 dark:text-neutral-900">
          ${title}
        </h4>`

      return el
    }))
  }
}
