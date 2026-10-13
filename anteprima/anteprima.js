// ============================================================
// MOCKUP of the new site — preview only.
// Payments, availability and forms are SIMULATED: nothing is charged or sent.
// Clips come from ../data.js (workData), so the preview always shows PJ's real work.
// ============================================================

const CONFIG = {
  instagram: "https://instagram.com/jayzefilms",
  igHandle: "@jayzefilms",
  email: "princejahaziel.reyes@gmail.com",
  maxPerDay: 5,
  heroClip: "https://res.cloudinary.com/dvam4kmk/video/upload/v1785252278/josh_qppclv.mov",
  packages: [
    { id:"social", name:"Social", price:280,
      points:["30–40 color-graded, social-ready clips","Delivered in 24–48 hours","Vertical or horizontal"] },
    { id:"complete", name:"Complete", price:380, featured:true,
      points:["20–30 color-graded, social-ready clips","Cinematic highlight recap","Delivered within a week","Vertical or horizontal"] },
    { id:"signature", name:"Signature", price:480,
      points:["Everything in Complete","Title sequence with your race city","Extra cinematic B-roll of the venue"] },
  ],
  addons: [
    { id:"photos", name:"Race photos", price:40, desc:"16 photos — 2 at every station" },
  ],
  // Sample event: HYROX Milano dates are real (hyrox.com); PJ's attendance and spots are simulated.
  events: [
    { id:"milano-2026", name:"HYROX Milano", venue:"Fiera Milano, Rho", days:["2026-12-04","2026-12-05","2026-12-06"],
      booked:{ "2026-12-04":2, "2026-12-05":4, "2026-12-06":5 },
      fullBlocks:["2026-12-05|Singles Pro"] },
  ],
  divisions: [
    { id:"Singles Open", sub:"Men or women, open category" },
    { id:"Singles Pro", sub:"Men or women, pro category" },
    { id:"Doubles", sub:"Two athletes, one recap each or together" },
    { id:"Relay", sub:"Team of four" },
  ],
  sources: [
    "PJ's Instagram", "An athlete's post or story", "A friend", "Facebook", "Google", "Other",
  ],
};

// ---------- Small helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const esc = s => String(s ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
const euro = n => "€" + n.toLocaleString("en-GB");
const parseDay = iso => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
const fmtDay = (date, opts = { weekday:"short", day:"numeric", month:"short" }) => date.toLocaleDateString("en-GB", opts);
const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; };

// ---------- Cloudinary renditions (same approach as ../main.js) ----------
const CLD_VIDEO = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/)(?:.*\/)?(v\d+\/.+?)\.\w+$/;
function cldVideo(src, transform, ext){
  const m = typeof src === "string" && src.match(CLD_VIDEO);
  return m ? `${m[1]}${transform}/${m[2]}.${ext}` : null;
}
const VIDEO = {
  tile:       src => cldVideo(src, "so_1,du_6,w_480,h_600,c_fill,q_auto,vc_h264,ac_none", "mp4") || src,
  tilePoster: src => cldVideo(src, "so_1,w_480,h_600,c_fill,q_auto", "jpg") || "",
  full:       src => cldVideo(src, "w_1920,h_1920,c_limit,q_auto,vc_h264", "mp4") || src,
  still:      src => cldVideo(src, "so_1,w_1080,h_1080,c_limit,q_auto", "jpg") || "",
  heroWide:   src => cldVideo(src, "so_10,du_16,w_1280,h_720,c_fill,q_auto,vc_h264,ac_none", "mp4"),
  heroTall:   src => cldVideo(src, "so_10,du_16,w_720,h_1280,c_fill,q_auto,vc_h264,ac_none", "mp4"),
  heroPoster: (src, tall) => cldVideo(src, tall ? "so_12,w_720,h_1280,c_fill,q_auto" : "so_12,w_1280,h_720,c_fill,q_auto", "jpg"),
  reel:       src => cldVideo(src, "so_10,du_16,w_800,h_500,c_fill,q_auto,vc_h264,ac_none", "mp4"),
  reelPoster: src => cldVideo(src, "so_12,w_800,h_500,c_fill,q_auto", "jpg"),
};

// ---------- Clips from data.js ----------
function allClips(){
  const out = [];
  if(typeof workData === "undefined") return out;
  Object.entries(workData.hyrox.cities).forEach(([city, c]) => {
    Object.entries(c.athletes || {}).forEach(([key, athlete]) => {
      const [name, division = ""] = key.split(" | ");
      (athlete.clips || []).forEach((clip, i) => {
        if(clip.type !== "video") return;
        out.push({ src:clip.src, name, division, city, date:c.date, first:i === 0,
                   type:/cinematic/i.test(clip.label || "") ? "cinematic" : "social" });
      });
    });
  });
  return out;
}

// ---------- Autoplay on scroll (muted previews play only while on screen) ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const visibleVideos = new Set();
let lightboxOpen = false;
const videoObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if(isIntersecting){ visibleVideos.add(target); playPreview(target); }
        else { visibleVideos.delete(target); target.pause(); }
      });
    }, { threshold:0.5 })
  : null;
function playPreview(video){
  if(reduceMotion || lightboxOpen) return;
  video.play().catch(() => {});
}
function observeVideo(video){ if(video && videoObserver) videoObserver.observe(video); }

function videoTile(c){
  const b = document.createElement("button");
  b.type = "button";
  b.className = "tile";
  b.setAttribute("aria-label", `Play ${c.name}, HYROX ${c.city}`);
  b.innerHTML = `
    <video src="${VIDEO.tile(c.src)}" poster="${VIDEO.tilePoster(c.src)}" muted loop playsinline preload="none"></video>
    ${c.type === "cinematic" ? '<span class="tile-tag cine">Cinematic recap</span>' : ""}
    <div class="tile-info">
      <div class="tile-name">${esc(c.name)}</div>
      <div class="tile-meta">${esc([c.division, c.city].filter(Boolean).join(" · "))}</div>
    </div>`;
  b.addEventListener("click", () => openLightbox(c));
  observeVideo(b.querySelector("video"));
  return b;
}

// ---------- Lightbox (full clip with sound) ----------
function openLightbox(c){
  let lb = $("#lightbox");
  if(!lb){
    lb = document.createElement("div");
    lb.id = "lightbox";
    lb.className = "lightbox";
    lb.innerHTML = `<button class="lightbox-close" aria-label="Close">✕</button><div class="lightbox-body"></div><div class="lightbox-caption"></div>`;
    document.body.appendChild(lb);
    lb.addEventListener("click", e => { if(e.target === lb || e.target.closest(".lightbox-close")) closeLightbox(); });
    document.addEventListener("keydown", e => { if(e.key === "Escape") closeLightbox(); });
  }
  $(".lightbox-body", lb).innerHTML = `<video src="${VIDEO.full(c.src)}" poster="${VIDEO.still(c.src)}" controls autoplay playsinline></video>`;
  $(".lightbox-caption", lb).textContent = [c.name, c.division, `HYROX ${c.city}`, c.date].filter(Boolean).join(" · ");
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
  lightboxOpen = true;
  visibleVideos.forEach(v => v.pause());
}
function closeLightbox(){
  const lb = $("#lightbox");
  if(!lb || !lb.classList.contains("open")) return;
  lb.classList.remove("open");
  $(".lightbox-body", lb).innerHTML = "";
  document.body.style.overflow = "";
  lightboxOpen = false;
  visibleVideos.forEach(playPreview);
}

// ---------- Source tracking (?ref=dylan → remembered on this device) ----------
function captureRef(){
  const ref = new URLSearchParams(location.search).get("ref");
  if(!ref) return;
  try{ localStorage.setItem("pj_ref", JSON.stringify({ ref, at:new Date().toISOString() })); }catch(e){}
}
function readRef(){
  try{ return JSON.parse(localStorage.getItem("pj_ref")); }catch(e){ return null; }
}

// ---------- Page chrome: preview banner, header, footer ----------
function renderChrome(){
  const page = document.body.dataset.page;
  if(page === "links") return; // the link-in-bio page has no site chrome
  const nav = [["portfolio.html","Work","portfolio"],["index.html#packages","Packages","packages"],["videografi.html","Videographers","videographers"],["brand.html","Brands","brand"]];
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="preview-banner">Anteprima · testi, prezzi e date da confermare · pagamenti simulati</div>
    <header class="site-header"><div class="wrap">
      <a class="brand" href="index.html">PJ Reyes</a>
      <nav class="nav">${nav.map(([href, label, id]) => `<a href="${href}" class="${id === page ? "active" : ""}">${label}</a>`).join("")}</nav>
      <a class="btn btn-primary btn-sm" href="prenota.html">Book your race</a>
    </div></header>`);
  document.body.insertAdjacentHTML("beforeend", `
    <footer class="site-footer"><div class="wrap">
      <div>© 2026 PJ Reyes · HYROX race filming</div>
      <nav>
        <a href="${CONFIG.instagram}" target="_blank" rel="noopener">Instagram ${CONFIG.igHandle}</a>
        <a href="mailto:${CONFIG.email}">Email</a>
        <a href="portfolio.html">Work</a>
        <a href="videografi.html">Videographers</a>
        <a href="brand.html">Brands</a>
        <a href="links.html">Link in bio</a>
      </nav>
    </div></footer>`);
}

// ---------- Home ----------
function initHome(){
  const hero = $("#heroVideo");
  if(hero){
    const tall = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
    hero.poster = VIDEO.heroPoster(CONFIG.heroClip, tall);
    if(!reduceMotion){
      hero.src = tall ? VIDEO.heroTall(CONFIG.heroClip) : VIDEO.heroWide(CONFIG.heroClip);
      hero.play().catch(() => {});
    }
  }
  const grid = $("#workGrid");
  if(grid) allClips().filter(c => c.first).slice(0, 8).forEach(c => grid.appendChild(videoTile(c)));

  const pk = $("#packageCards");
  if(pk){
    pk.innerHTML = CONFIG.packages.map(p => `
      <article class="pkg ${p.featured ? "featured" : ""}">
        ${p.featured ? '<span class="pkg-badge">Recommended</span>' : ""}
        <h3>${p.name}</h3>
        <div class="pkg-price">${euro(p.price)} <small>per athlete</small></div>
        <ul>${p.points.map(x => `<li>${x}</li>`).join("")}</ul>
        <a class="btn ${p.featured ? "btn-primary" : "btn-ghost"} btn-block" href="prenota.html?package=${p.id}">Book ${p.name}</a>
      </article>`).join("");
  }
  const races = $("#raceList");
  if(races){
    races.innerHTML = CONFIG.events.map(ev => {
      const first = parseDay(ev.days[0]), last = parseDay(ev.days[ev.days.length - 1]);
      const left = ev.days.reduce((n, d) => n + Math.max(0, CONFIG.maxPerDay - (ev.booked[d] || 0)), 0);
      return `
        <div class="race">
          <div>
            <h3>${ev.name}</h3>
            <div class="muted">${ev.venue} · ${first.getDate()}–${fmtDay(last, { day:"numeric", month:"short", year:"numeric" })}</div>
            <div class="spots" style="margin-top:8px">${left} of ${ev.days.length * CONFIG.maxPerDay} spots left</div>
          </div>
          <a class="btn btn-primary" href="prenota.html?event=${ev.id}">Book this race</a>
        </div>`;
    }).join("");
  }
}

// ---------- Portfolio ----------
function initPortfolio(){
  const grid = $("#portfolioGrid"), cityChips = $("#cityChips"), typeChips = $("#typeChips");
  if(!grid) return;
  // Each athlete's lead clip first, so the feed opens with different faces instead of one athlete's set.
  const clips = allClips().sort((a, b) => b.first - a.first);
  const cities = [...new Set(clips.map(c => c.city))];
  let city = "All", type = "All";
  const chip = (label, active) => `<button type="button" class="chip" aria-pressed="${active}" data-value="${esc(label)}">${esc(label)}</button>`;
  function render(){
    cityChips.innerHTML = ["All", ...cities].map(c => chip(c, c === city)).join("");
    typeChips.innerHTML = ["All", "Social clips", "Cinematic recaps"].map(t => chip(t, t === type)).join("");
    if(videoObserver) videoObserver.disconnect();
    visibleVideos.clear();
    grid.innerHTML = "";
    const list = clips.filter(c => (city === "All" || c.city === city) &&
      (type === "All" || (type === "Cinematic recaps") === (c.type === "cinematic")));
    list.forEach(c => grid.appendChild(videoTile(c)));
    $("#portfolioCount").textContent = `${list.length} clip${list.length === 1 ? "" : "s"}`;
    if(!list.length) grid.innerHTML = '<p class="empty">No clips for this filter yet.</p>';
  }
  cityChips.addEventListener("click", e => { const b = e.target.closest(".chip"); if(b){ city = b.dataset.value; render(); } });
  typeChips.addEventListener("click", e => { const b = e.target.closest(".chip"); if(b){ type = b.dataset.value; render(); } });
  render();
}

// ---------- Link in bio ----------
function initLinks(){
  const reel = $("#bioReel");
  if(reel){
    reel.poster = VIDEO.reelPoster(CONFIG.heroClip);
    if(!reduceMotion){ reel.src = VIDEO.reel(CONFIG.heroClip); reel.play().catch(() => {}); }
  }
}

// ---------- Simulated forms (shot list, LUT waitlist, brands, other race) ----------
function initForms(){
  document.querySelectorAll("form[data-simulate]").forEach(form => {
    if(form.dataset.bound) return;
    form.dataset.bound = "1";
    form.addEventListener("submit", e => {
      e.preventDefault();
      if(!form.reportValidity()) return;
      const name = esc(form.querySelector("[name=name]")?.value.trim() || "");
      form.outerHTML = `<div class="success"><strong>${name ? `Thanks, ${name}!` : "Thanks!"}</strong>
        <p class="muted" style="margin:6px 0 0">${esc(form.dataset.simulate)}</p></div>
        <div class="mock-note">Simulazione: nel sito vero questo modulo salva il contatto nel database e fa partire la sequenza email giusta.</div>`;
    });
  });
}

// ---------- Booking wizard (simulated) ----------
function initBooking(){
  const body = $("#wizardBody");
  if(!body) return;
  const params = new URLSearchParams(location.search);
  const state = {
    step:0, eventId:params.get("event") || (CONFIG.events.length === 1 ? CONFIG.events[0].id : ""), day:"", division:"", startTime:"",
    pkg:CONFIG.packages.some(p => p.id === params.get("package")) ? params.get("package") : "",
    addons:new Set(), name:"", email:"", ig:"", phone:"", source:"", sourceDetail:"",
    terms:false, marketing:false, pay:"deposit",
  };
  const STEPS = ["Race", "Division", "Package", "Your details", "Review & pay"];
  const ev = () => CONFIG.events.find(e => e.id === state.eventId);
  const pkg = () => CONFIG.packages.find(p => p.id === state.pkg);
  const total = () => (pkg()?.price || 0) + CONFIG.addons.filter(a => state.addons.has(a.id)).reduce((n, a) => n + a.price, 0);
  const deposit = () => Math.round(total() / 2);
  const spotsLeft = day => Math.max(0, CONFIG.maxPerDay - (ev()?.booked[day] || 0));
  const blockFull = div => (ev()?.fullBlocks || []).includes(`${state.day}|${div}`);
  const option = (attrs, pressed, title, sub = "", price = "", disabled = false) =>
    `<button type="button" class="option" ${attrs} aria-pressed="${pressed}" ${disabled ? "disabled" : ""}>
       ${price ? `<span class="option-price">${price}</span>` : ""}
       <div class="option-title">${title}</div>${sub ? `<div class="option-sub">${sub}</div>` : ""}
     </button>`;

  function valid(){
    switch(state.step){
      case 0: return !!(state.eventId && state.day);
      case 1: return !!state.division && !blockFull(state.division);
      case 2: return !!state.pkg;
      case 3: return state.name.trim() && /\S+@\S+\.\S+/.test(state.email) && state.source && state.terms;
      default: return true;
    }
  }

  function stepHtml(){
    switch(state.step){
      case 0: {
        const e = ev();
        return `
          <h2>Which race are you doing?</h2>
          <div class="options">${CONFIG.events.map(x => option(`data-event="${x.id}"`, x.id === state.eventId, x.name, `${x.venue}`)).join("")}</div>
          <p class="muted" style="font-size:14px">Racing somewhere else? <a href="#" data-action="other-race">Tell me which race</a>.</p>
          <div id="otherRace"></div>
          ${e ? `<div class="label">Day</div>
          <div class="options cols-2">${e.days.map(d => {
            const left = spotsLeft(d);
            return option(`data-day="${d}"`, d === state.day, fmtDay(parseDay(d)),
              left ? `${left} of ${CONFIG.maxPerDay} spots left` : "Full · join the waitlist", "", !left);
          }).join("")}</div>` : ""}
          <div class="mock-note">Massimo ${CONFIG.maxPerDay} atleti al giorno (decisione di PJ). Le date di HYROX Milano sono reali; la presenza di PJ e i posti occupati sono simulati. Nel sito vero gli eventi arrivano dal calendario Google "HYROX – Eventi".</div>`;
      }
      case 1:
        return `
          <h2>Your division</h2>
          <div class="options">${CONFIG.divisions.map(d => {
            const full = blockFull(d.id);
            return option(`data-division="${d.id}"`, d.id === state.division, d.id,
              full ? "This start block is full — pick another day or join the waitlist" : d.sub, "", full);
          }).join("")}</div>
          <div class="field">
            <label for="startTime">Your start time <span class="muted">(only if you already know it)</span></label>
            <input id="startTime" type="time" value="${esc(state.startTime)}">
          </div>
          <p class="muted" style="font-size:14px;line-height:1.6;margin:0">HYROX publishes individual start times about 3 days before the race. No start time yet? No problem: I'll ask you for it then.</p>
          <div class="mock-note">Regola proposta: massimo 1 cliente per fascia oraria della stessa divisione, così le partenze non si sovrappongono. Qui "Singles Pro" di sabato è simulata come piena.</div>`;
      case 2: {
        const team = state.division === "Doubles" || state.division === "Relay";
        return `
          <h2>Pick your package</h2>
          <div class="options">${CONFIG.packages.map(p => option(`data-pkg="${p.id}"`, p.id === state.pkg,
            `${p.name}${p.featured ? ' <span class="eyebrow" style="margin-left:6px">Recommended</span>' : ""}`,
            p.points.join(" · "), euro(p.price))).join("")}</div>
          <div class="label">Add-ons</div>
          <div class="options">${CONFIG.addons.map(a => option(`data-addon="${a.id}"`, state.addons.has(a.id), a.name, a.desc, "+" + euro(a.price))).join("")}</div>
          ${team ? `<div class="mock-note">Prezzo per doubles e relay ancora da decidere: qui sono mostrati i prezzi del singolo.</div>` : ""}
          <div class="mock-note">Nome e contenuto del pacchetto da 480 € da confermare (intervista esclusa per ora).</div>`;
      }
      case 3: {
        const ref = readRef();
        const showDetail = state.source === "An athlete's post or story" || state.source === "Other";
        return `
          <h2>Your details</h2>
          <div class="field"><label for="f-name">Full name</label><input id="f-name" data-bind="name" autocomplete="name" value="${esc(state.name)}"></div>
          <div class="field"><label for="f-email">Email</label><input id="f-email" data-bind="email" type="email" autocomplete="email" value="${esc(state.email)}"></div>
          <div class="field"><label for="f-ig">Instagram <span class="muted">(so I can tag you)</span></label><input id="f-ig" data-bind="ig" placeholder="@" value="${esc(state.ig)}"></div>
          <div class="field"><label for="f-phone">Phone <span class="muted">(for race day)</span></label><input id="f-phone" data-bind="phone" type="tel" autocomplete="tel" value="${esc(state.phone)}"></div>
          <div class="field"><label for="f-source">How did you hear about me?</label>
            <select id="f-source" data-bind="source"><option value="">Choose one</option>
              ${CONFIG.sources.map(s => `<option ${s === state.source ? "selected" : ""}>${esc(s)}</option>`).join("")}
            </select></div>
          ${showDetail ? `<div class="field"><label for="f-detail">${state.source === "Other" ? "Tell me more" : "Whose post or story? (@)"}</label><input id="f-detail" data-bind="sourceDetail" value="${esc(state.sourceDetail)}"></div>` : ""}
          <label class="check"><input type="checkbox" data-bind="terms" ${state.terms ? "checked" : ""}>
            <span>I accept the <a href="#" onclick="return false">terms</a>: the 50% deposit is non-refundable, but I can move it once to another race within 12 months, up to 3 days before the race.</span></label>
          <label class="check"><input type="checkbox" data-bind="marketing" ${state.marketing ? "checked" : ""}>
            <span>Send me news about upcoming races and offers. <span class="muted">(Optional)</span></span></label>
          <div class="mock-note">${ref ? `Fonte tracciata dal link: <strong>ref=${esc(ref.ref)}</strong>. ` : "Prova ad aprire questa pagina con <code>?ref=dylan</code> alla fine dell'indirizzo: il sito ricorda da quale link è arrivata la persona. "}
            La domanda "come mi hai conosciuto" + il link personale servono a capire quali atleti e influencer portano davvero clienti.</div>`;
      }
      case 4: {
        const e = ev(), p = pkg(), addons = CONFIG.addons.filter(a => state.addons.has(a.id));
        return `
          <h2>Review & pay</h2>
          <div class="summary">
            <div class="summary-row"><span>Race</span><span>${e.name} · ${fmtDay(parseDay(state.day))}</span></div>
            <div class="summary-row"><span>Division</span><span>${esc(state.division)}</span></div>
            <div class="summary-row"><span>Start time</span><span>${state.startTime ? esc(state.startTime) : "You'll add it 3 days before"}</span></div>
            <div class="summary-row"><span>Package</span><span>${p.name} · ${euro(p.price)}</span></div>
            ${addons.map(a => `<div class="summary-row"><span>Add-on</span><span>${a.name} · ${euro(a.price)}</span></div>`).join("")}
            <div class="summary-row total"><span>Total</span><span>${euro(total())}</span></div>
          </div>
          <div class="label">How do you want to pay?</div>
          <div class="options">
            ${option('data-pay="deposit"', state.pay === "deposit", `Pay 50% now`, `${euro(deposit())} today, ${euro(total() - deposit())} right after the race`, euro(deposit()))}
            ${option('data-pay="full"', state.pay === "full", "Pay in full now", "Nothing to pay on race day", euro(total()))}
          </div>
          <div class="pay-methods">Card · Apple Pay · Google Pay · Revolut Pay · Bank transfer — secure checkout by Stripe</div>`;
      }
    }
  }

  function render(){
    const bar = $("#progress");
    bar.innerHTML = STEPS.map((_, i) => `<span class="${i <= state.step ? "done" : ""}"></span>`).join("");
    $("#stepLabel").textContent = `Step ${state.step + 1} of ${STEPS.length} · ${STEPS[state.step]}`;
    body.innerHTML = stepHtml();
    $("#backBtn").style.visibility = state.step === 0 ? "hidden" : "visible";
    $("#nextBtn").textContent = state.step === STEPS.length - 1 ? "Continue to secure payment →" : "Continue →";
    refreshNext();
  }
  const refreshNext = () => { $("#nextBtn").disabled = !valid(); };

  body.addEventListener("click", e => {
    const t = e.target.closest("[data-event],[data-day],[data-division],[data-pkg],[data-addon],[data-pay],[data-action]");
    if(!t) return;
    if(t.dataset.action === "other-race"){
      e.preventDefault();
      $("#otherRace").innerHTML = `
        <form data-simulate="PJ will tell you if he's filming that race. (Simulated: nothing was sent.)" class="card" style="margin-bottom:18px">
          <div class="field"><label>Which race?</label><input name="race" required placeholder="e.g. HYROX Bologna"></div>
          <div class="field"><label>Your email</label><input name="email" type="email" required></div>
          <button class="btn btn-ghost btn-sm" type="submit">Let me know</button>
        </form>`;
      initForms();
      return;
    }
    if(t.dataset.event){ state.eventId = t.dataset.event; state.day = ""; }
    if(t.dataset.day) state.day = t.dataset.day;
    if(t.dataset.division) state.division = t.dataset.division;
    if(t.dataset.pkg) state.pkg = t.dataset.pkg;
    if(t.dataset.addon){ state.addons.has(t.dataset.addon) ? state.addons.delete(t.dataset.addon) : state.addons.add(t.dataset.addon); }
    if(t.dataset.pay) state.pay = t.dataset.pay;
    render();
  });
  function onField(e){
    if(e.target.id === "startTime") state.startTime = e.target.value;
    const key = e.target.dataset.bind;
    if(key) state[key] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if(key === "source" && e.type === "change") render(); // shows or hides the "whose post?" field
    refreshNext();
  }
  body.addEventListener("input", onField);
  body.addEventListener("change", onField);
  $("#backBtn").addEventListener("click", () => { if(state.step > 0){ state.step--; render(); window.scrollTo(0, 0); } });
  $("#nextBtn").addEventListener("click", () => {
    if(!valid()) return;
    if(state.step < STEPS.length - 1){ state.step++; render(); window.scrollTo(0, 0); return; }
    simulatePayment();
  });

  function simulatePayment(){
    $("#wizardNav").hidden = true;
    $("#progress").hidden = true;
    $("#stepLabel").textContent = "";
    body.innerHTML = `<div class="stripe-sim"><div class="spinner"></div><p>Redirecting to secure checkout…</p>
      <div class="mock-note" style="text-align:left">Simulazione: qui il cliente va sulla pagina di pagamento Stripe. Nessun pagamento reale.</div></div>`;
    window.scrollTo(0, 0);
    setTimeout(showConfirmation, 1600);
  }

  function showConfirmation(){
    const e = ev(), race = parseDay(state.day), paid = state.pay === "full" ? total() : deposit();
    const due = total() - paid;
    const hasRecap = state.pkg !== "social";
    const steps = [
      ["now", "Today", `Booking confirmed`, `${euro(paid)} paid. Confirmation sent to ${esc(state.email)}.`],
      ["", fmtDay(addDays(race, -14)), "Personalise your HYROX ticket", "HYROX only gives start times to personalised tickets. I'll remind you."],
      ["", fmtDay(addDays(race, -3)), "Send your start time", "The start list is out: add your start time from your booking page."],
      ["", fmtDay(addDays(race, -1)), "Meeting point", "Where and when we meet: 30 minutes before your start."],
      ["", fmtDay(race), "Race day. I film.", due ? `After the finish you pay the balance (${euro(due)}) by link or QR code.` : "Nothing left to pay. Just race."],
      ["", fmtDay(addDays(race, 2)), "Your clips", hasRecap ? "Social-ready clips first, your cinematic recap within a week." : "Your social-ready clips, ready to post."],
    ];
    body.innerHTML = `
      <div class="eyebrow">You're booked</div>
      <h2>See you in ${esc(e.name.replace("HYROX ", ""))}, ${esc(state.name.split(" ")[0])}.</h2>
      <p class="muted" style="line-height:1.6">${esc(state.division)} · ${fmtDay(race, { weekday:"long", day:"numeric", month:"long" })}. Here's what happens next:</p>
      <ol class="timeline">${steps.map(([cls, when, title, text]) => `<li class="${cls}"><strong>${when} · ${title}</strong><span>${text}</span></li>`).join("")}</ol>
      <div class="mock-note">Simulazione. Nel sito vero: pagamento con Stripe, prenotazione salvata nel database, evento nel calendario "HYROX – Clienti" di PJ e queste email partono in automatico alle date indicate.</div>
      <div class="wizard-nav"><a class="btn btn-ghost" href="index.html">Back to home</a><a class="btn btn-primary" href="prenota.html">New simulation</a></div>`;
  }

  render();
}

document.addEventListener("DOMContentLoaded", () => {
  captureRef();
  renderChrome();
  initHome();
  initPortfolio();
  initLinks();
  initForms();
  initBooking();
});
