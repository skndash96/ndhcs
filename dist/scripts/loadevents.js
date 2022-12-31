import { db, getDocs, query, limit, orderBy, collection, storage, ref, list, getDownloadURL } from "./firebase.js"

export default function loadEvents() {
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
      docs.forEach(doc => events.push(doc.data()))
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
    
    Promise.all(docs.map(async ({title,date,dir}) => {
      try {
        date = new Date(date.seconds*1000)
        
        var el = document.createElement("div")
        el.className = "mt-8 grid grid-cols-2 md:grid-cols-3 gap-4"
        el.innerHTML = `
        <div class="col-span-2 md:col-span-3">
          <hr class="h-1 w-full mx-auto max-w-xs bg-sky-500">
          <h3 class="mt-4 font-semibold text-center">
            ${title} <br> ${("0"+date.getDate().toString()).slice(-2)}/${date.getMonth()+1}/${date.getFullYear()}
          </h3>
        </div>`
        
        let imgs = []
        let results = await list(ref(storage, dir))
        for (let i = 0; i < results.items.length; i++) {
          let url = await getDownloadURL(results.items[i])
          let imgBox = document.createElement("div")
          imgBox.className = `${i===1 ? "row-span-2" : ""} ${i===3 ? "col-span-2" : ""} min-h-[10rem] bg-slate-700`
          imgBox.innerHTML = `<img alt="${title} ${i+1}" src="${url}" loading="lazy" class="w-full h-full">`
          imgs.push(imgBox)
        }
        el.append(...imgs)
      } catch (e) {
        console.error(e)
      } finally {
        return el
      }
    }))
    .then(evs => {
      if (!evs.length) evs.push("Events could not be loaded. Try again later.")
      eventsEl.append(...evs)
      spinner.classList.add("hidden")
    })
    
  }
}