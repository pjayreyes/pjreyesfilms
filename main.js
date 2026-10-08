function initHeader(){
  document.getElementById("igLink").href = IG_URL;
  document.getElementById("emailLink").href = "mailto:" + EMAIL;
  const checkoutPageBottom = document.getElementById("checkoutPageBottom");
  if(checkoutPageBottom) checkoutPageBottom.href = CHECKOUT_PAGE;
  const page = document.body.dataset.page;
  document.querySelectorAll(".navlink").forEach(a => {
    if(a.dataset.page === page) a.classList.add("active");
  });
}

function buildTile(item, navHandler){
  const el = document.createElement("button");
  el.className = "tile clickable";
  const fitClass = item.fit === "contain" ? "fit-contain" : "";
  const media = item.type === "video"
    ? `<video class="${fitClass}" src="${item.src}" muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()"></video>`
    : `<img class="${fitClass}" src="${item.src}" alt="${item.title}">`;
  el.innerHTML = `
    ${media}
    <div class="tile-overlay">
      <div class="tile-tc">${item.tc || ""}</div>
      <div class="tile-title">${item.title}</div>
      <div class="tile-cat">${item.label || ""}</div>
    </div>
  `;
  el.addEventListener("click", () => {
    if(navHandler) navHandler();
    else openLightbox(item);
  });
  return el;
}

// ---------- LIGHTBOX (click a clip to play it with sound) ----------
function ensureLightbox(){
  let lb = document.getElementById("lightbox");
  if(!lb){
    lb = document.createElement("div");
    lb.id = "lightbox";
    lb.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content"></div>
      <button class="lightbox-close" aria-label="Close">✕</button>
    `;
    document.body.appendChild(lb);
    lb.querySelector(".lightbox-backdrop").addEventListener("click", closeLightbox);
    lb.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeLightbox(); });
  }
  return lb;
}

function openLightbox(item){
  const lb = ensureLightbox();
  const content = lb.querySelector(".lightbox-content");
  content.innerHTML = item.type === "video"
    ? `<video src="${item.src}" controls autoplay playsinline></video>`
    : `<img src="${item.src}" alt="${item.title}">`;
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox(){
  const lb = document.getElementById("lightbox");
  if(!lb) return;
  lb.classList.remove("open");
  lb.querySelector(".lightbox-content").innerHTML = "";
  document.body.style.overflow = "";
}

// ---------- WORK PAGE (drill-down) ----------
function initWorkPage(){
  const grid = document.getElementById("grid");
  const crumbEl = document.getElementById("breadcrumb");
  const headingEl = document.getElementById("sectionHeading");
  if(!grid) return;

  let path = []; // e.g. [] | ["hyrox"] | ["hyrox","Roma"] | ["hyrox","Roma","Marco Rossi"] | ["running"] | ["others"]

  function go(newPath){
    path = newPath;
    render();
  }

  function renderBreadcrumb(){
    const crumbs = [{ label:"Work", path:[] }];
    if(path[0] === "hyrox"){
      crumbs.push({ label:"Hyrox", path:["hyrox"] });
      if(path[1]) crumbs.push({ label:path[1], path:["hyrox", path[1]] });
      if(path[2]) crumbs.push({ label:path[2], path:["hyrox", path[1], path[2]] });
    } else if(path[0] === "running"){
      crumbs.push({ label:"Running", path:["running"] });
    } else if(path[0] === "others"){
      crumbs.push({ label:"Others", path:["others"] });
    }
    crumbEl.innerHTML = crumbs.map((c, i) => {
      const isLast = i === crumbs.length - 1;
      if(isLast) return `<span class="current">${c.label}</span>`;
      return `<button data-idx="${i}">${c.label}</button><span class="sep">/</span>`;
    }).join("");
    crumbEl.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => go(crumbs[+btn.dataset.idx].path));
    });
  }

  function render(){
    grid.innerHTML = "";
    headingEl.textContent = "";
    grid.style.display = "grid";
    document.getElementById("comingSoon").style.display = "none";
    const ctaEl = document.getElementById("igLinkWork");
    const showCta = path[0] === "hyrox" && (path.length === 2 || path.length === 3);
    if(ctaEl) ctaEl.style.display = showCta ? "block" : "none";
    renderBreadcrumb();

    if(path.length === 0){
      headingEl.textContent = "Categories";
      grid.appendChild(buildTile({ src:workData.hyrox.cover, title:"Hyrox", label:"Race Coverage", tc:"", fit:"contain" }, () => go(["hyrox"])));
      grid.appendChild(buildTile({ src:workData.running[0].src, title:"Running", label:"Brand & Endurance", tc:"" }, () => go(["running"])));
      grid.appendChild(buildTile({ src:"https://placehold.co/800x800/1a1a1a/555?text=Coming+Soon", title:"Others", label:"Coming Soon", tc:"" }, () => go(["others"])));

    } else if(path[0] === "hyrox" && path.length === 1){
      headingEl.textContent = "Hyrox — Cities";
      Object.entries(workData.hyrox.cities).forEach(([city, data]) => {
        grid.appendChild(buildTile({ src:data.cover, title:city, label:data.date, tc:"", fit:"contain" }, () => go(["hyrox", city])));
      });

    } else if(path[0] === "hyrox" && path.length === 2){
      const city = workData.hyrox.cities[path[1]];
      headingEl.textContent = `Hyrox ${path[1]} — Athletes`;
      Object.entries(city.athletes).forEach(([athlete, data]) => {
        grid.appendChild(buildTile({ src:data.cover, title:athlete, label:path[1], tc:"" }, () => go(["hyrox", path[1], athlete])));
      });

    } else if(path[0] === "hyrox" && path.length === 3){
      const athlete = workData.hyrox.cities[path[1]].athletes[path[2]];
      headingEl.textContent = path[2];
      athlete.clips.forEach(clip => grid.appendChild(buildTile(clip)));

    } else if(path[0] === "running"){
      headingEl.textContent = "Running";
      workData.running.forEach(clip => grid.appendChild(buildTile(clip)));

    } else if(path[0] === "others"){
      grid.style.display = "none";
      const cs = document.getElementById("comingSoon");
      cs.style.display = "block";
      cs.textContent = "Coming soon — focused on Hyrox right now.";
    }
  }

  render();
}

// ---------- PACKAGES PAGE ----------
function renderPackages(){
  const container = document.getElementById("packagesList");
  if(!container) return;
  const grouped = {};
  packages.forEach(p => {
    if(!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });
  container.innerHTML = Object.entries(grouped).map(([cat, items]) => `
    <div class="cat-label">${cat}</div>
    ${items.map(p => `
      <div class="package-card">
        <h2>${p.name}</h2>
        <p>${p.description}</p>
        <div class="price">${p.price}</div>
      </div>
    `).join("")}
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initWorkPage();
  renderPackages();
});