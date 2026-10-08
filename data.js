// ============================================================
// EDIT THIS FILE — everything on the site is driven from here.
// ============================================================

// ---- YOUR LINKS ----
const IG_URL = "https://instagram.com/jayzefilms";
const CHECKOUT_PAGE = "https://tally.so/r/b5JvoZ";
const EMAIL = "princejahaziel.reyes@gmail.com";

// ---- MAIN PAGE: your best works, no categories, just a showcase ----
// type: "image" or "video" | src: thumbnail/clip | title: name shown on hover
// label: short tag shown on hover | tc: small accent tag (date/price/timecode)
const bestWorks = [
  { type:"image", src:"https://placehold.co/800x800/1a1a1a/888?text=Hyrox+Roma", title:"Hyrox Roma", label:"Race Coverage", tc:"09.2026" },
  { type:"image", src:"https://placehold.co/800x800/1a1a1a/888?text=Hyrox+Istanbul", title:"Hyrox Istanbul", label:"Full Day Coverage", tc:"USD 500" },
  { type:"image", src:"https://placehold.co/800x800/1a1a1a/888?text=Endorphin", title:"Endorphin Run Club", label:"Brand Film", tc:"TORINO" },
  { type:"image", src:"https://placehold.co/800x800/1a1a1a/888?text=Ironman", title:"Ironman", label:"Endurance Racing", tc:"00:42" },
];

// ---- WORK PAGE ----
// Hyrox drills down: city -> athlete -> clips.
// Add a new city by copying a city block. Add a new athlete by copying an athlete block.
// Videos: paste the Cloudinary link of the original upload (.mov/.mp4, any size).
// The site builds the light 6-second previews, the posters and the full-screen
// version from that link automatically. The athlete tile plays their FIRST clip.
// cover (optional): full https:// image link used as the athlete tile's still frame.
const workData = {
  hyrox: {
    cover: "resources/Hyrox_logo.png",
    cities: {
      "Istanbul": {
        cover: "resources/Hyrox_istanbul.png",
        date: "08.2026",
        athletes: {
          "Gioele Patroni | Pro Men": {
            clips: [
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1787310425/gioele00055332_cyaqon.mov", title:"Gioele Patroni", label:"Social Media-Ready Clip Sample", tc:"08.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1787310469/gioele00064311_dywmsn.mov", title:"Gioele Patroni", label:"Social Media-Ready Clip Sample", tc:"08.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1787336507/gioele00058210_vqpchn.mov", title:"Gioele Patroni", label:"Social Media-Ready Clip Sample", tc:"08.2026" }
            ]
          },
          "Merve | Open Single Women": {
            clips: [
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1787336726/merve00091182_sr9jqt.mov", title:"Merve", label:"Social Media-Ready Clip Sample", tc:"08.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1787336637/merve00102324_x8dyfw.mov", title:"Merve", label:"Social Media-Ready Clip Sample", tc:"08.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1787336873/merve00094308_qpwvlf.mov", title:"Merve", label:"Social Media-Ready Clip Sample", tc:"08.2026" }
            ]
          },
        }
      },
      "Stockholm": {
        cover: "resources/Hyrox_stockholm.png",
        date: "06.2026",
        athletes: {
          "Alyssa McElheny | Elite 15 Women": {
            clips: [
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785250132/Alyssa1_hsi7oh.mov", title:"Alyssa McElheny", label:"Social Media-Ready Clip Sample", tc:"06.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785250207/Alyssa4_tyefj0.mov", title:"Alyssa McElheny", label:"Social Media-Ready Clip Sample", tc:"06.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785250203/Alyssa3_uhu4r8.mov", title:"Alyssa McElheny", label:"Social Media-Ready Clip Sample", tc:"06.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785250164/Alyssa2_drgasi.mov", title:"Alyssa McElheny", label:"Social Media-Ready Clip Sample", tc:"06.2026" },
            ]
          },
          "Josh White | Pro Men": {
            clips: [
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785252278/josh_qppclv.mov", title:"Josh White", label:"Cinematic Highlight Recap", tc:"06.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785252286/josh1_hbmawt.mov", title:"Josh White", label:"Social Media-Ready Clip Sample", tc:"06.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785251565/josh2_kjrids.mov", title:"Josh White", label:"Social Media-Ready Clip Sample", tc:"06.2026" },
            ]
          },
          "Ana Esparza | Pro Women": {
            clips: [
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785249529/ana1_pspzxj.mov", title:"Ana Esparza", label:"Social Media-Ready Clip Sample", tc:"06.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785249654/ana2_iemhtc.mov", title:"Ana Esparza", label:"Social Media-Ready Clip Sample", tc:"06.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785249627/ana3_ualzsv.mov", title:"Ana Esparza", label:"Social Media-Ready Clip Sample", tc:"06.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785249670/ana4_bgvegr.mov", title:"Ana Esparza", label:"Social Media-Ready Clip Sample", tc:"06.2026" },
            ]
          }
        }
      },
      "Rimini": {
        cover: "resources/Hyrox_rimini.png",
        date: "05.2026",
        athletes: {
          "Hugo Hugemarq | Pro Men x Elite Athlete": {
            clips: [
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785251520/hugo1_kakcs0.mov", title:"Hugo Hugemarq", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785251507/hugo2_c4d3uu.mov", title:"Hugo Hugemarq", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785251518/hugo3_sk3pmy.mov", title:"Hugo Hugemarq", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785251525/hugo4_zmkjak.mov", title:"Hugo Hugemarq", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
            ]
          },
          "Etta Bruzzi | Women Open": {
            clips: [
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785251183/EB2_ttncod.mov", title:"Etta Bruzzi", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785251184/EB3_qbbanl.mov", title:"Etta Bruzzi", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785251138/EB4_cdhkxu.mov", title:"Etta Bruzzi", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785251177/EB6_lfuc6h.mov", title:"Etta Bruzzi", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785251171/EB8_hinei3.mov", title:"Etta Bruzzi", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
            ]
          },
          "Manuela & Simone | Double Mixed": {
            clips: [
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785252648/manuela_e_simone_xnyll3.mov", title:"Manuela & Simone", label:"Cinematic Highlight Recap", tc:"05.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785252543/manuela_e_simone1_f7oqdj.mov", title:"Manuela & Simone", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785252605/manuela_e_simone2_r0sg8f.mov", title:"Manuela & Simone", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
              { type:"video", src:"https://res.cloudinary.com/dvam4kmk/video/upload/v1785252586/manuela_e_simone3_egkx1c.mov", title:"Manuela & Simone", label:"Social Media-Ready Clip Sample", tc:"05.2026" },
            ]
          }
        }
      },
      "Bologna": {
        cover: "https://placehold.co/800x800/1a1a1a/888?text=Coming Soon",
        date: "04.2026",
        athletes: {
          /*"Luca Ferrari": {
            cover: "https://placehold.co/800x800/1a1a1a/888?text=Luca+Ferrari",
            clips: [
              { type:"image", src:"https://placehold.co/800x800/1a1a1a/888?text=Clip+1", title:"Luca Ferrari", label:"Hyrox Bologna", tc:"04.2026" },
            ]
          }*/
        }
      },
      "Turin": {
        cover: "https://placehold.co/800x800/1a1a1a/888?text=Coming Soon",
        date: "01.2026",
        athletes: {
          /*"Luca Ferrari": {
            cover: "https://placehold.co/800x800/1a1a1a/888?text=Luca+Ferrari",
            clips: [
              { type:"image", src:"https://placehold.co/800x800/1a1a1a/888?text=Clip+1", title:"Luca Ferrari", label:"Hyrox Bologna", tc:"04.2026" },
            ]
          }*/
        }
      }
    }
  },
  // Flat list, no drill-down.
  /*running: [
    { type:"image", src:"https://placehold.co/800x800/1a1a1a/888?text=Endorphin", title:"Endorphin Run Club", label:"Brand Film", tc:"TORINO" },
    { type:"image", src:"https://placehold.co/800x800/1a1a1a/888?text=Ironman", title:"Ironman", label:"Endurance Racing", tc:"00:42" },
  ]*/
};

// ---- PACKAGES PAGE ----
const packages = [
  {
    category: "Hyrox",
    name: "Social Media Package",
    description: "30 to 40 color-graded, social-media-ready clips from race day. Delivered within 24-48 hours. Vertical or horizontal",
    price: "€ 280"
  },
  {
    category: "Hyrox",
    name: "Complete Package",
    description: "20 to 30 color-graded, social-media-ready clips plus a cinematic highlight reel. Delivered within a week. Vertical or horizontal",
    price: "€ 380"
  }
];
