import { db, getDocs, query, limit, orderBy, collection, storage, ref, list, getDownloadURL } from "./firebase.js"

export default function loadEvents(mini) {
  const eventsEl = document.getElementById("events")
  const spinner = eventsEl.firstElementChild
  
  const expTime = 24*60*60*1000

  const events = JSON.parse(localStorage["events"] || null)
  if (events && events[0] > Date.now()) {
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
    while (eventsEl.children.length > 1) {
      eventsEl.removeChild(eventsEl.lastElementChild)
    }
    
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
          el.className = "h-full relative flex flex-col gap-1 bg-stone-800/75 shadow-lg"
          el.innerHTML = `
          <span class="px-2 py-1 text-gray-50 font-semibold">${title}</span>
          <span class="px-2 py-1 text-blue-300 grow text-sm">${("0"+date.getDate().toString()).slice(-2)}/${date.getMonth()+1}/${date.getFullYear()}</span>
          <a href="/events?eid=${encodeURIComponent(id)}" class="p-1 block absolute bottom-0 right-0 bg-slate-700 text-gray-50 icon" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg></a>
          <div class="min-h-[5rem] shadow-[0_-1px_10px_5px_rgba(0,0,0,.15)] bg-slate-400"><img class="w-full" src="${imgUrls[Math.floor(Math.random()*imgUrls.length)]}" alt="${title}"></div>`
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