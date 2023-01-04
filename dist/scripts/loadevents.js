import { db, getDocs, query, limit, orderBy, collection, storage, ref, list, getDownloadURL } from "./firebase.js"

export default function loadEvents(mini, force=false) {
  const eventsEl = document.getElementById("events")
  const spinner = document.getElementById("eventsSpinner")

  eventsEl.replaceChildren() /*Spinner is out.*/
  spinner.classList.remove("hidden")
  
  const expTime = 24*60*60*1000

  const events = JSON.parse(localStorage["events"] || null)
  if (!force && events && events[0] > Date.now()) {
    writeEvs(events.slice(1))
  }
  else {
    getDocs(query(collection(db, "events"), orderBy("date", "desc"), limit(10)))
    .then(docs => {
      let events = [Date.now() + expTime]
      docs.forEach(doc => events.push({id:doc.id, ...doc.data()}))
      localStorage["events"] = JSON.stringify(events)
      
      writeEvs(events.slice(1))
    })
    .catch(e => {
      console.error(e)
      spinner.innerHTML = "Try again later."
    })
  }

  function writeEvs(docs) {
    Promise.all(docs.map(async ({id,title,date,dir},i) => {
      try {
        date = new Date(date.seconds*1000)

        let imgUrls = JSON.parse(localStorage.getItem("eventImages")||null)?.[id] || []
        if (!imgUrls.length) {
          let imgRefs = await list(ref(storage, dir))
          for (let i=0; i<imgRefs.items.length; i++) imgUrls.push(await getDownloadURL(imgRefs.items[i]))
          let obj = JSON.parse(localStorage.getItem("eventImages")||null) || {}
          obj[id] = imgUrls
          localStorage.setItem("eventImages", JSON.stringify(obj))
        }
        
        if (mini) {
          var el = document.createElement("div")
          el.id = id
          el.className = "h-full relative flex flex-col group shadow-lg hover:shadow-xl"
          el.innerHTML = `
          <a href="/events?eid=${encodeURIComponent(id)}" class="block absolute top-0 bottom-0 right-0 left-0" target="_blank"></a>
          <div class="min-h-[5rem] grow bg-slate-400"><img class="w-full h-full" src="${imgUrls[Math.floor(Math.random()*imgUrls.length)]}" alt="${title}"></div>
          <div class="p-2 bg-blue-900 text-gray-50">
            <span class="group-hover:underline text-gray-50 font-semibold">${title}</span><br>
            <span class="text-blue-200 text-sm">${("0"+date.getDate().toString()).slice(-2)}/${date.getMonth()+1}/${date.getFullYear()}</span>
          </div>`
          eventsEl.classList.add("grid-cols-2", "sm:grid-cols-"+Math.min(docs.length,4), "md:grid-cols-"+Math.min(docs.length,6), "lg:grid-cols-"+Math.min(docs.length,8))
        } else {
          let cols = 2,
            mdcols = 3
          var el = document.createElement("div")
          el.id = id
          el.className = `mt-8 grid grid-cols-${cols} md:grid-cols-${mdcols} grid-flow-dense gap-4`
          el.innerHTML = `
          <div class="col-span-2 md:col-span-3">
            <hr class="h-1 w-full mx-auto max-w-xs bg-sky-500">
            <h3 class="mt-4 font-semibold text-center">
              ${title} <br> ${("0"+date.getDate().toString()).slice(-2)}/${date.getMonth()+1}/${date.getFullYear()}
            </h3>
          </div>`

          let imgs = []
          let big = [2,5,8]
          for (let i = 0; i < imgUrls.length; i++) {
            let imgBox = document.createElement("div")
            imgBox.className = `${big.includes(i) ? "col-span-2" : ""} min-h-[10rem] bg-slate-700`
            imgBox.innerHTML = `<img alt="${title} ${i+1}" src="${imgUrls[i]}" loading="lazy" class="w-full h-full">`
            imgs.push(imgBox)
          }
          
          el.append(...imgs)
          let extra = big.findLastIndex(v => v<=imgs.length)+1
          big.includes(imgs.length-1) && extra--
          el.lastElementChild.classList.add("col-span-"+(((imgs.length+extra)%cols)+1), "md:col-span-"+(((imgs.length+extra)%mdcols)+1))
        }
      } catch (e) {
        console.error(e)
      } finally {
        return el
      }
    }))
    .then(evs => {
      if (!evs.length) evs.push("Events could not be loaded. Try again later.")
      eventsEl.append(...evs.slice(0, mini ? 8 : evs.length))
      spinner.classList.add("hidden")
      
      if (!mini) {
        const indexEl= document.createElement("ol")
        indexEl.className = "list-decimal w-fit mx-auto flex flex-col gap-1"
        indexEl.innerHTML = docs.map(({id,title}) => `<li><a href="#${id}" class="hover:underline text-blue-600">${title}</a></li>`).join("")
        eventsEl.prepend(indexEl)
        const querystring = window.location.href.split("?").length > 1 && Object.fromEntries(window.location.href.split("?")[1].split("&").map(x => [x.split("=")[0], decodeURIComponent(x.split("=")[1])]))
        querystring?.eid && document.getElementById(querystring.eid)?.scrollIntoView(true)
      }
    })
  }
}