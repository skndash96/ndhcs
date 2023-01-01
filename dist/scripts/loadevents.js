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
      const events = [Date.now() + expTime]
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

        let imgRefs = await list(ref(storage, dir))
        
        if (mini) {
          var el = document.createElement("div")
          el.id = id
          el.className = "flex flex-col gap-1"
          el.innerHTML = `
          <span class="">${title}</span>
          <span class="text-sm">${("0"+date.getDate().toString()).slice(-2)}/${date.getMonth()+1}/${date.getFullYear()}</span>
          <div><img class="w-full" src="${await getDownloadURL(imgRefs.items[0])}" alt="${title}"></div>
          <a href="/events?eid=${encodeURIComponent(id)}" class="underline text-center text-blue-600" target="_blank">View all</a>`
          eventsEl.classList.add("grid-cols-2", "sm:grid-cols-"+Math.min(docs.length,5), "md:grid-cols-"+Math.min(docs.length,7), "lg:grid-cols-"+Math.min(docs.length,9))
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
          for (let i = 0; i < imgRefs.items.length; i++) {
            let url = await getDownloadURL(imgRefs.items[i])
            let imgBox = document.createElement("div")
            imgBox.className = `${big.includes(i) ? "col-span-2" : ""} min-h-[10rem] bg-slate-700`
            imgBox.innerHTML = `<img alt="${title} ${i+1}" src="${url}" loading="lazy" class="w-full h-full">`
            imgs.push(imgBox)
          }
          
          el.append(...imgs)
          let extra = big.findLastIndex(v => v<=imgs.length)+1
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
      eventsEl.append(...evs.slice(0, mini ? 5 : evs.length))
      spinner.classList.add("hidden")
      
      const params = window.location.href.split("?").length > 1 && Object.fromEntries(window.location.href.split("?")[1].split("&").map(x => [x.split("=")[0], decodeURIComponent(x.split("=")[1])]))
      params?.eid && document.getElementById(params.eid)?.scrollIntoView()
    })
  }
}