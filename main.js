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

// ---------- VIDEO RENDITIONS (Cloudinary) ----------
// The originals are heavy .mov files (HEVC, ~55 MB each) that some browsers can't play.
// Cloudinary builds lighter H.264 versions on the fly from the same URL, so data.js
// only ever needs the original link.
const CLD_VIDEO = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/)(?:.*\/)?(v\d+\/.+?)\.\w+$/;

function cldVideo(src, transform, ext){
  const m = typeof src === "string" && src.match(CLD_VIDEO);
  return m ? `${m[1]}${transform}/${m[2]}.${ext}` : null;
}

const VIDEO = {
  preview: src => cldVideo(src, "so_1,du_6,w_640,h_640,c_fill,q_auto,vc_h264,ac_none", "mp4") || src, // 6s muted square loop
  poster:  src => cldVideo(src, "so_1,w_640,h_640,c_fill,q_auto", "jpg") || "",
  full:    src => cldVideo(src, "w_1920,h_1920,c_limit,q_auto,vc_h264", "mp4") || src,              // lightbox, with sound
  still:   src => cldVideo(src, "so_1,w_1080,h_1080,c_limit,q_auto", "jpg") || "",
};

const isUrl = s => typeof s === "string" && /^https?:\/\//.test(s);

// ---------- AUTOPLAY ON SCROLL ----------
// Muted previews play only while on screen (iOS needs muted + playsinline), so a phone
// downloads just the clips in view. Reduced-motion users get the still posters.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const visibleVideos = new Set();
let lightboxOpen = false;

const videoObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if(isIntersecting){ visibleVideos.add(target); playPreview(target); }
        else { visibleVideos.delete(target); target.pause(); }
      });
    }, { threshold: 0.5 })
  : null;

function playPreview(video){
  if(reduceMotion || lightboxOpen) return;
  video.play().catch(() => {}); // e.g. iOS Low Power Mode blocks autoplay: the poster stays
}

function resetVideoObserver(){
  if(videoObserver) videoObserver.disconnect();
  visibleVideos.clear();
}

function buildTile(item, navHandler){
  const el = document.createElement("button");
  el.className = "tile clickable";
  const fitClass = item.fit === "contain" ? "fit-contain" : "";
  const media = item.type === "video"
    ? `<video class="${fitClass}" src="${VIDEO.preview(item.src)}" poster="${isUrl(item.poster) ? item.poster : VIDEO.poster(item.src)}" muted loop playsinline preload="none"></video>`
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
  const video = el.querySelector("video");
  if(video && videoObserver) videoObserver.observe(video);
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
    ? `<video src="${VIDEO.full(item.src)}" poster="${VIDEO.still(item.src)}" controls autoplay playsinline></video>`
    : `<img src="${item.src}" alt="${item.title}">`;
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
  lightboxOpen = true;
  visibleVideos.forEach(v => v.pause());
}

function closeLightbox(){
  const lb = document.getElementById("lightbox");
  if(!lb || !lb.classList.contains("open")) return;
  lb.classList.remove("open");
  lb.querySelector(".lightbox-content").innerHTML = "";
  document.body.style.overflow = "";
  lightboxOpen = false;
  visibleVideos.forEach(playPreview);
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
    window.scrollTo(0, 0); // each drill-down level starts from the top
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

  function showComingSoon(text){
    grid.style.display = "none";
    const cs = document.getElementById("comingSoon");
    cs.style.display = "block";
    cs.textContent = text;
  }

  function render(){
    resetVideoObserver();
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
      if(workData.running && workData.running.length){
        grid.appendChild(buildTile({ src:workData.running[0].src, title:"Running", label:"Brand & Endurance", tc:"" }, () => go(["running"])));
      }
      grid.appendChild(buildTile({ src:"https://placehold.co/800x800/1a1a1a/555?text=Coming+Soon", title:"Others", label:"Coming Soon", tc:"" }, () => go(["others"])));

    } else if(path[0] === "hyrox" && path.length === 1){
      headingEl.textContent = "Hyrox — Cities";
      Object.entries(workData.hyrox.cities).forEach(([city, data]) => {
        grid.appendChild(buildTile({ src:data.cover, title:city, label:data.date, tc:"", fit:"contain" }, () => go(["hyrox", city])));
      });

    } else if(path[0] === "hyrox" && path.length === 2){
      const city = workData.hyrox.cities[path[1]];
      headingEl.textContent = `Hyrox ${path[1]} — Athletes`;
      const athletes = Object.entries(city.athletes);
      if(athletes.length === 0) showComingSoon("Clips from this race are coming soon.");
      athletes.forEach(([athlete, data]) => {
        // The athlete tile plays their first clip; `cover` (a full URL) is only used as its poster.
        const firstVideo = (data.clips || []).find(c => c.type === "video");
        const tile = firstVideo
          ? { type:"video", src:firstVideo.src, poster:data.cover, title:athlete, label:path[1], tc:"" }
          : { src:data.cover, title:athlete, label:path[1], tc:"" };
        grid.appendChild(buildTile(tile, () => go(["hyrox", path[1], athlete])));
      });

    } else if(path[0] === "hyrox" && path.length === 3){
      const athlete = workData.hyrox.cities[path[1]].athletes[path[2]];
      headingEl.textContent = path[2];
      athlete.clips.forEach(clip => grid.appendChild(buildTile(clip)));

    } else if(path[0] === "running"){
      headingEl.textContent = "Running";
      workData.running.forEach(clip => grid.appendChild(buildTile(clip)));

    } else if(path[0] === "others"){
      showComingSoon("Coming soon — focused on Hyrox right now.");
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