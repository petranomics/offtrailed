import { useState, useEffect } from "react";

// THEMES - customize the entire look and feel
const THEMES = {
  "forest": {
    name: "Timber Line",
    bg: "#0e1a12",
    fg: "#8fbc6a",
    hi: "#d4f0c0",
    dim: "rgba(143,188,106,0.6)",
    mut: "rgba(143,188,106,0.45)",
    acc: "#e8a835",
    ac2: "#d45a3a",
    ac3: "#6ab8d4",
    ok: "#6abf5a",
    cbg: "rgba(143,188,106,0.03)",
    cbd: "rgba(143,188,106,0.12)",
    ab: "rgba(143,188,106,0.08)",
    abd: "rgba(143,188,106,0.35)",
    ina: "rgba(143,188,106,0.1)",
    ibg: "rgba(143,188,106,0.04)",
    ibd: "rgba(143,188,106,0.2)",
    srf: "rgba(14,26,18,0.94)",
    bgGradient: "linear-gradient(to bottom, #0a0f0c 0%, #0e1a12 50%, #0e1a12 100%)",
    mountainColor: "#1a3a1f",
    cloudColor: "rgba(143,188,106,0.15)",
  },
  "vaporwave": {
    name: "Neon Summit",
    bg: "#1a1a2e",
    fg: "#e8e0f0",
    hi: "#ff006e",
    dim: "rgba(232,224,240,0.6)",
    mut: "rgba(232,224,240,0.4)",
    acc: "#00f5ff",
    ac2: "#ff6b9d",
    ac3: "#c239b3",
    ok: "#00f5ff",
    cbg: "rgba(232,224,240,0.05)",
    cbd: "rgba(232,224,240,0.15)",
    ab: "rgba(232,224,240,0.1)",
    abd: "rgba(232,224,240,0.3)",
    ina: "rgba(232,224,240,0.08)",
    ibg: "rgba(232,224,240,0.03)",
    ibd: "rgba(232,224,240,0.15)",
    srf: "rgba(26,26,46,0.96)",
    bgGradient: "linear-gradient(135deg, #0f0419 0%, #1a1a2e 50%, #16213e 100%)",
    mountainColor: "#c239b3",
    cloudColor: "rgba(232,224,240,0.2)",
  },
  "bachelorette": {
    name: "Wildflower",
    bg: "#ede4d3",
    fg: "#d63384",
    hi: "#ff1493",
    dim: "rgba(214,51,132,0.6)",
    mut: "rgba(214,51,132,0.45)",
    acc: "#ffc300",
    ac2: "#ff85a1",
    ac3: "#a0428e",
    ok: "#d63384",
    cbg: "rgba(214,51,132,0.04)",
    cbd: "rgba(214,51,132,0.12)",
    ab: "rgba(214,51,132,0.08)",
    abd: "rgba(214,51,132,0.25)",
    ina: "rgba(214,51,132,0.08)",
    ibg: "rgba(214,51,132,0.02)",
    ibd: "rgba(214,51,132,0.15)",
    srf: "rgba(237,228,211,0.95)",
    bgGradient: "linear-gradient(135deg, #e0d5c1 0%, #ede4d3 50%, #d9cebb 100%)",
    mountainColor: "#d63384",
    cloudColor: "rgba(255,105,180,0.2)",
  }
};

function getTheme(themeName) {
  return THEMES[themeName] || THEMES.forest;
}

// Trail Fork Mark — brand logo (dashed boring path, curved novel path, gold fork dot)
function TrailForkMark({ size = 24, theme }) {
  var s = size;
  return (
    <svg viewBox="0 0 40 60" width={s} height={s * 1.5} style={{ display: "inline-block", verticalAlign: "middle" }}>
      {/* Boring path — dashed, fading upward */}
      <line x1="20" y1="58" x2="20" y2="5" stroke={theme.mut} strokeWidth="2" strokeDasharray="3 4" opacity={0.4} />
      {/* Novel path — curved right and up */}
      <path d="M20,38 C22,32 28,26 34,16" fill="none" stroke={theme.fg} strokeWidth="2.5" strokeLinecap="round" />
      {/* Discovery dots along novel path */}
      <circle cx="25" cy="30" r="1.5" fill={theme.fg} opacity={0.5} />
      <circle cx="29" cy="24" r="2" fill={theme.fg} opacity={0.7} />
      <circle cx="34" cy="16" r="3" fill={theme.fg} />
      {/* Gold fork-point dot */}
      <circle cx="20" cy="38" r="3" fill="#E8A835" />
    </svg>
  );
}

// SVG Background Components — one per theme
function ForestBackground({ theme, opacity = 0.3 }) {
  return (
    <svg viewBox="0 0 1000 400" style={{
      position: "absolute", bottom: 0, left: 0,
      width: "100%", height: "100%", opacity: opacity
    }}>
      <defs>
        <linearGradient id="forestMtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme.mountainColor} stopOpacity={0.6} />
          <stop offset="100%" stopColor={theme.mountainColor} stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="forestTreeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2d5a1e" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#1a3a1f" stopOpacity={0.2} />
        </linearGradient>
      </defs>
      {/* Topographic contour lines */}
      <path d="M0,80 Q250,60 500,85 T1000,75" fill="none" stroke={theme.cloudColor} strokeWidth="0.5" />
      <path d="M0,110 Q300,90 600,115 T1000,105" fill="none" stroke={theme.cloudColor} strokeWidth="0.5" />
      <path d="M0,140 Q200,125 500,145 T1000,135" fill="none" stroke={theme.cloudColor} strokeWidth="0.5" />
      <path d="M0,170 Q350,155 700,175 T1000,165" fill="none" stroke={theme.cloudColor} strokeWidth="0.5" />
      {/* Far mountain ridge */}
      <polygon points="0,300 150,120 300,200 500,80 700,180 850,100 1000,250 1000,400 0,400"
               fill="url(#forestMtGrad)" style={{opacity: 0.4}} />
      {/* Mid mountain ridge */}
      <polygon points="0,350 100,200 250,260 400,160 600,240 750,180 900,230 1000,300 1000,400 0,400"
               fill="url(#forestMtGrad)" style={{opacity: 0.6}} />
      {/* Near mountain ridge */}
      <polygon points="0,380 200,280 400,320 550,260 700,310 850,270 1000,350 1000,400 0,400"
               fill="url(#forestMtGrad)" style={{opacity: 0.8}} />
      {/* Trees along the bottom */}
      {[50, 120, 180, 280, 350, 420, 530, 600, 680, 760, 840, 920].map(function(x, i) {
        var h = 30 + (i % 3) * 12;
        var baseY = 380 - (i % 2) * 10;
        return (
          <polygon key={i}
            points={x + "," + baseY + " " + (x - 10) + "," + (baseY + h) + " " + (x + 10) + "," + (baseY + h)}
            fill="url(#forestTreeGrad)"
            style={{opacity: 0.5 + (i % 3) * 0.1}}
          />
        );
      })}
    </svg>
  );
}

function VaporwaveBackground({ theme, opacity = 0.25 }) {
  return (
    <svg viewBox="0 0 1000 400" style={{
      position: "absolute", bottom: 0, left: 0,
      width: "100%", height: "100%", opacity: opacity
    }}>
      <defs>
        <linearGradient id="vwSunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff006e" stopOpacity={0.6} />
          <stop offset="50%" stopColor="#ff006e" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#c239b3" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      {/* Retro sun with horizontal stripe cutouts */}
      <circle cx="500" cy="200" r="80" fill="url(#vwSunGrad)" />
      {[170, 180, 190, 200, 210, 220, 230].map(function(y, i) {
        return (
          <rect key={i} x="420" y={y} width="160"
                height={2 + i * 0.5}
                fill={theme.bg} style={{opacity: 0.7}} />
        );
      })}
      {/* Perspective grid — horizontal lines */}
      {[240, 260, 285, 315, 350, 400].map(function(y, i) {
        return (
          <line key={"h" + i} x1="0" y1={y} x2="1000" y2={y}
                stroke={theme.mountainColor} strokeWidth="0.8"
                style={{opacity: 0.3 - i * 0.03}} />
        );
      })}
      {/* Perspective grid — converging vertical lines */}
      {[-200, -100, 0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200].map(function(x, i) {
        return (
          <line key={"v" + i} x1="500" y1="240" x2={x} y2="400"
                stroke={theme.mountainColor} strokeWidth="0.6"
                style={{opacity: 0.25}} />
        );
      })}
      {/* Floating diamond shapes */}
      {[{x: 150, y: 100, s: 8}, {x: 800, y: 80, s: 6}, {x: 350, y: 60, s: 5}, {x: 680, y: 130, s: 7}].map(function(d, i) {
        return (
          <polygon key={"d" + i}
            points={d.x + "," + (d.y - d.s) + " " + (d.x + d.s) + "," + d.y + " " + d.x + "," + (d.y + d.s) + " " + (d.x - d.s) + "," + d.y}
            fill="none" stroke="#00f5ff" strokeWidth="0.5"
            style={{opacity: 0.4}}
          />
        );
      })}
    </svg>
  );
}

function WildflowerBackground({ theme, opacity = 0.2 }) {
  function flower(cx, cy, petalR, color, op) {
    var petals = [];
    for (var i = 0; i < 5; i++) {
      var angle = (i * 72 - 90) * Math.PI / 180;
      var px = cx + Math.cos(angle) * petalR * 0.8;
      var py = cy + Math.sin(angle) * petalR * 0.8;
      petals.push(
        <circle key={i} cx={px} cy={py} r={petalR} fill={color} opacity={op} />
      );
    }
    petals.push(
      <circle key="center" cx={cx} cy={cy} r={petalR * 0.5}
              fill={theme.acc} opacity={op * 0.6} />
    );
    return petals;
  }

  return (
    <svg viewBox="0 0 1000 400" style={{
      position: "absolute", bottom: 0, left: 0,
      width: "100%", height: "100%", opacity: opacity
    }}>
      {/* Soft rolling hills */}
      <path d="M0,350 Q150,300 300,330 Q450,360 600,320 Q750,280 900,310 Q950,320 1000,340 L1000,400 L0,400 Z"
            fill={theme.mountainColor} opacity={0.15} />
      <path d="M0,370 Q200,340 400,360 Q600,380 800,350 Q900,340 1000,360 L1000,400 L0,400 Z"
            fill={theme.mountainColor} opacity={0.1} />
      {/* Curving vine stems */}
      <path d="M100,400 Q120,300 160,250 Q200,200 180,150"
            fill="none" stroke={theme.mountainColor} strokeWidth="1" opacity={0.2} />
      <path d="M800,400 Q780,320 820,260 Q860,200 840,160"
            fill="none" stroke={theme.mountainColor} strokeWidth="1" opacity={0.2} />
      <path d="M450,400 Q430,330 470,280 Q510,230 490,180"
            fill="none" stroke={theme.mountainColor} strokeWidth="1" opacity={0.15} />
      {/* Flowers at stem tips and scattered */}
      <g>{flower(180, 150, 10, theme.cloudColor, 0.5)}</g>
      <g>{flower(840, 160, 8, theme.cloudColor, 0.4)}</g>
      <g>{flower(490, 180, 9, theme.cloudColor, 0.35)}</g>
      <g>{flower(650, 80, 7, theme.cloudColor, 0.3)}</g>
      <g>{flower(300, 120, 6, theme.cloudColor, 0.25)}</g>
      {/* Small pollen dots */}
      {[{x:200, y:180}, {x:820, y:190}, {x:470, y:210}, {x:620, y:110},
        {x:350, y:150}, {x:550, y:170}, {x:150, y:250}, {x:750, y:220},
        {x:280, y:200}, {x:700, y:150}].map(function(p, i) {
        return (
          <circle key={i} cx={p.x} cy={p.y} r={1.5}
                  fill={theme.acc} opacity={0.3} />
        );
      })}
    </svg>
  );
}

// Alias the default theme colors for backwards compatibility
const BG = THEMES.forest.bg;
const FG = THEMES.forest.fg;
const HI = THEMES.forest.hi;
const DIM = THEMES.forest.dim;
const MUT = THEMES.forest.mut;
const ACC = THEMES.forest.acc;
const AC2 = THEMES.forest.ac2;
const AC3 = THEMES.forest.ac3;
const OK = THEMES.forest.ok;
const CBG = THEMES.forest.cbg;
const CBD = THEMES.forest.cbd;
const AB = THEMES.forest.ab;
const ABD = THEMES.forest.abd;
const INA = THEMES.forest.ina;
const IBG = THEMES.forest.ibg;
const IBD = THEMES.forest.ibd;
const SRF = THEMES.forest.srf;

const USERS = {
  "demo@offtrailed.com": { pw: "trail123", name: "Alex Rivera", type: "user" },
  "biz@coffeehaus.com": { pw: "biz123", name: "Coffee Haus", type: "business" },
  "admin@offtrailed.com": { pw: "admin123", name: "Trail Admin", type: "admin" },
};

const DEMO_TRAIL = [
  { time: "10:00 AM", name: "Cathedral of Junk", category: "hidden", description: "Towering backyard sculpture made from decades of collected objects.", insider_tip: "Call ahead — it's in someone's yard.", est_cost: "Free", checkedIn: false },
  { time: "11:30 AM", name: "Graffiti Park Remnants", category: "art", description: "Murals migrated to HOPE Gallery's new location.", est_cost: "Free", checkedIn: false },
  { time: "1:00 PM", name: "Veracruz All Natural", category: "food", description: "Migas tacos that locals swear by. Green salsa is legendary.", est_cost: "$12", checkedIn: true, incentive: "Free chips & salsa with check-in" },
  { time: "3:00 PM", name: "Museum of the Weird", category: "hidden", description: "Curiosity cabinet on Dirty 6th. Shrunken heads and cryptids.", est_cost: "$12", checkedIn: false },
];

const DEMO_COLLAB = {
  title: "SXSW Group Trip", members: ["Alex", "Jordan", "Pat"],
  stops: [
    { time: "11 AM", name: "Torchy's Secret Menu", description: "Off-menu Green Chile Pork tacos.", votes: { up: 3, down: 0 } },
    { time: "1 PM", name: "SXSW Free Stage", description: "Free outdoor performances at Auditorium Shores.", votes: { up: 2, down: 1 } },
    { time: "4 PM", name: "Rainey St Crawl", description: "Bungalow bar hop through converted houses.", votes: { up: 1, down: 2 } },
    { time: "7 PM", name: "Franklin BBQ Pop-up", description: "If you see the line, get in it.", votes: { up: 3, down: 0 } },
  ]
};

function extractJSON(raw) {
  var t = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  try { return JSON.parse(t); } catch (e) { /* continue */ }
  var s = t.indexOf("{"), en = t.lastIndexOf("}");
  if (s >= 0 && en > s) {
    try { return JSON.parse(t.substring(s, en + 1)); } catch (e) { /* continue */ }
  }
  return null;
}

function stripTags(s) {
  if (!s || typeof s !== 'string') return s;
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function App() {
  var [themeName, setThemeName] = useState("forest");
  var theme = getTheme(themeName);

  // Styles (uses active theme)
  var inp = { width: "100%", background: theme.ibg, border: "1px solid " + theme.ibd, color: theme.fg, fontFamily: "monospace", fontSize: 13, padding: "10px 12px", outline: "none", borderRadius: 3, boxSizing: "border-box" };
  var lbl = { fontSize: 9, letterSpacing: 3, color: theme.dim, fontFamily: "monospace", display: "block", marginBottom: 6 };
  var card = { background: theme.cbg, border: "1px solid " + theme.cbd, borderRadius: 4, padding: 16 };
  function btn(pri, extra) {
    return { background: pri ? theme.fg : "transparent", color: pri ? theme.bg : theme.fg, border: pri ? "none" : "1px solid " + theme.ina, fontFamily: "monospace", fontSize: 11, padding: "10px 20px", cursor: "pointer", borderRadius: 3, letterSpacing: 2, fontWeight: pri ? 700 : 400, ...(extra || {}) };
  }
  function sel(active) {
    return { background: active ? theme.ab : theme.cbg, border: "1px solid " + (active ? theme.abd : theme.ina), color: active ? theme.fg : theme.mut, fontFamily: "monospace", cursor: "pointer", borderRadius: 3, padding: "6px 8px", fontSize: 10 };
  }

  var [pg, setPg] = useState("home");
  var [user, setUser] = useState(null);
  var [email, setEmail] = useState("demo@offtrailed.com");
  var [pw, setPw] = useState("trail123");
  var [authErr, setAuthErr] = useState("");
  var [showAuth, setShowAuth] = useState(false);

  // Builder
  var [loc, setLoc] = useState("Austin, Texas");
  var today = new Date();
  var todayStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
  var nowStr = String(today.getHours()).padStart(2, "0") + ":" + String(today.getMinutes()).padStart(2, "0");
  var [date, setDate] = useState(todayStr);
  var [startTime, setStartTime] = useState("10:00");
  var [endTime, setEndTime] = useState("15:00");
  var [vibe, setVibe] = useState("hidden-gems");
  var [budget, setBudget] = useState("$$");
  var [mission, setMission] = useState("");
  var [loading, setLoading] = useState(false);
  var [ldMsg, setLdMsg] = useState("");

  // Results
  var [stops, setStops] = useState([]);
  var [active, setActive] = useState(null);
  var [note, setNote] = useState("");
  var [tweak, setTweak] = useState("");

  // Saved
  var [saved, setSaved] = useState([{ id: "t1", title: "Austin Hidden Gems", date: "2026-02-01", stops: DEMO_TRAIL }]);

  // Collab
  var [colVotes, setColVotes] = useState({});

  // Biz
  var [deals, setDeals] = useState([
    { id: "1", text: "Free chips & salsa with check-in", on: true, ct: 47 },
    { id: "2", text: "10% off with check-in", on: true, ct: 89 },
  ]);
  var [newDeal, setNewDeal] = useState("");

  // Admin - Algorithm Control
  var [boosts, setBoosts] = useState([
    { id: "1", name: "Coffee Haus", type: "highlight", pct: 15, on: true },
    { id: "2", name: "Museum of the Weird", type: "highlight", pct: 10, on: true },
  ]);
  var [bName, setBName] = useState("");
  var [bType, setBType] = useState("highlight");
  var [bPct, setBPct] = useState("15");

  var phr = ["Reading terrain...", "Scanning intel...", "Filtering traps...", "Plotting waypoints...", "Trail locked..."];
  useEffect(function () {
    if (!loading) return;
    var i = 0;
    var iv = setInterval(function () { setLdMsg(phr[i % phr.length]); i++; }, 1800);
    return function () { clearInterval(iv); };
  }, [loading]);

  function login() {
    var u = USERS[email];
    if (!u || u.pw !== pw) { setAuthErr("Invalid credentials"); return; }
    setUser({ email: email, name: u.name, type: u.type });
    setAuthErr("");
    setShowAuth(false);
    if (u.type === "admin") setPg("admin");
    else if (u.type === "business") setPg("biz");
    else setPg("home");
  }

  async function generate() {
    if (!loc.trim()) return;
    setLoading(true);
    setStops([]);
    setNote("");
    setPg("results");
    try {
      var activeBoosts = boosts.filter(function (b) { return b.on; });
      var boostHints = activeBoosts.length > 0 ? "\n\nAlgorithm Control (apply these biases):\n" + activeBoosts.map(function (b) { return (b.type === "highlight" ? "[+" + b.pct + "%] HIGHLIGHT" : "[-" + b.pct + "%] LOWLIGHT") + ": " + b.name; }).join("\n") : "";
      var durationHours = Math.abs((endTime.split(":")[0] - startTime.split(":")[0]) + (endTime.split(":")[1] - startTime.split(":")[1]) / 60);
      var durationLabel = durationHours <= 3 ? "2-3 hours" : durationHours <= 6 ? "half day" : durationHours <= 10 ? "full day" : "overnight";
      var query = (mission ? "Focus on: " + mission + "\n" : "") + "Trail for " + loc + " on " + date + " from " + startTime + " to " + endTime + " (" + durationLabel + "), vibe: " + vibe + ", budget: " + budget + ". Generate 6-10 real, verified stops.\nJSON: {\"stops\":[{\"time\":\"10:00 AM\",\"name\":\"N\",\"category\":\"food\",\"description\":\"Desc\",\"insider_tip\":\"Tip\",\"est_cost\":\"$10\"}],\"trail_note\":\"Note\",\"total_est_cost\":\"$X\"}" + boostHints;
      var res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
      });
      var data;
      try {
        data = await res.json();
      } catch (err) {
        setNote("Lost the signal. Try again.");
        setLoading(false);
        return;
      }
      if (!data) { setNote("Lost the signal. Try again."); setLoading(false); return; }
      var answer = data.answer || data.response || "";
      var parsed = extractJSON(answer);
      if (parsed && parsed.stops) {
        setStops(parsed.stops.map(function (s) { return Object.assign({}, s, { checkedIn: false, name: stripTags(s.name), description: stripTags(s.description), insider_tip: stripTags(s.insider_tip), est_cost: stripTags(s.est_cost), incentive: stripTags(s.incentive) }); }));
        setNote(stripTags(parsed.trail_note || ""));
        setActive(0);
      } else {
        setNote(stripTags(answer || JSON.stringify(data)));
      }
    } catch (e) {
      setNote("Lost the signal: " + e.message);
    }
    setLoading(false);
  }

  // Nav helper
  function navBtn(target, label) {
    return (
      <button key={target} onClick={function () { setPg(target); }} style={{ background: pg === target ? theme.ab : "transparent", border: "1px solid " + (pg === target ? theme.abd : "transparent"), color: pg === target ? theme.fg : theme.mut, fontFamily: "monospace", fontSize: 8, padding: "4px 8px", cursor: "pointer", borderRadius: 3, letterSpacing: 2 }}>{label}</button>
    );
  }

  var checkedCount = stops.filter(function (s) { return s.checkedIn; }).length;

  return (
    <div style={{ background: theme.bg, color: theme.fg, minHeight: "100vh", fontFamily: "'Courier New', monospace" }}>

      {/* ===== HEADER ===== */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, padding: "8px 12px", background: theme.srf, borderBottom: "1px solid " + theme.cbd, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={function () { setPg("home"); }}>
          <TrailForkMark size={14} theme={theme} />
          <span style={{ fontSize: 11, letterSpacing: 5, color: theme.hi, fontWeight: 700 }}>OFFTRAILED</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {user && user.type === "user" && (
            <span>{navBtn("home", "HOME")}{navBtn("profile", "TRAILS")}{navBtn("collab", "COLLAB")}</span>
          )}
          {user && user.type === "business" && navBtn("biz", "DASHBOARD")}
          {user && user.type === "admin" && navBtn("admin", "ADMIN")}
          {user ? (
            <span style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: theme.ab, border: "1px solid " + theme.abd, fontSize: 8, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{user.name[0]}</span>
              <button onClick={function () { setUser(null); setPg("home"); }} style={{ fontSize: 8, color: theme.mut, background: "none", border: "none", cursor: "pointer", fontFamily: "monospace" }}>OUT</button>
            </span>
          ) : (
            <button onClick={function () { setShowAuth(!showAuth); }} style={btn(false, { padding: "4px 12px", fontSize: 9 })}>SIGN IN</button>
          )}
        </div>
      </div>

      {/* ===== AUTH DROPDOWN ===== */}
      {showAuth && !user && (
        <div style={{ maxWidth: 360, margin: "0 auto", padding: "12px 16px" }}>
          <div style={{ ...card, padding: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: theme.hi, fontWeight: 700, marginBottom: 12 }}>SIGN IN</div>
            <div style={{ marginBottom: 8 }}><label style={lbl}>EMAIL</label><input value={email} onChange={function (e) { setEmail(e.target.value); }} style={inp} /></div>
            <div style={{ marginBottom: 8 }}><label style={lbl}>PASSWORD</label><input type="password" value={pw} onChange={function (e) { setPw(e.target.value); }} style={inp} /></div>
            {authErr && <p style={{ fontSize: 10, color: theme.ac2, marginBottom: 6 }}>{authErr}</p>}
            <button onClick={login} style={btn(true, { width: "100%", marginBottom: 10 })}>SIGN IN</button>
            <div style={{ borderTop: "1px solid " + theme.ina, paddingTop: 8 }}>
              <p style={{ fontSize: 8, color: theme.mut, textAlign: "center", letterSpacing: 2, marginBottom: 6 }}>DEMO ACCOUNTS (click to fill)</p>
              {[["demo@offtrailed.com", "trail123", "🧭 Explorer"], ["biz@coffeehaus.com", "biz123", "☕ Business"], ["admin@offtrailed.com", "admin123", "⚡ Admin"]].map(function (a) {
                return (
                  <button key={a[0]} onClick={function () { setEmail(a[0]); setPw(a[1]); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "5px 8px", marginBottom: 3, background: email === a[0] ? theme.ab : "transparent", border: "1px solid " + (email === a[0] ? theme.abd : theme.ina), borderRadius: 3, cursor: "pointer", color: theme.fg, fontFamily: "monospace", fontSize: 9 }}>
                    {a[2]} — <span style={{ color: theme.mut, fontSize: 8 }}>{a[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== HOME / TRAIL BUILDER ===== */}
      {pg === "home" && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 16, position: "relative" }}>
          {/* Background design */}
          <div style={{ position: "fixed", top: 60, left: 0, right: 0, height: "400px", background: theme.bgGradient, zIndex: -1, pointerEvents: "none" }}>
            {themeName === "forest" && <ForestBackground theme={theme} opacity={0.3} />}
            {themeName === "vaporwave" && <VaporwaveBackground theme={theme} opacity={0.25} />}
            {themeName === "bachelorette" && <WildflowerBackground theme={theme} opacity={0.2} />}
          </div>

          {/* Theme Selector */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24, marginTop: 12 }}>
            {Object.keys(THEMES).map(function (tKey) {
              var t = THEMES[tKey];
              return (
                <button
                  key={tKey}
                  onClick={function () { setThemeName(tKey); }}
                  style={{
                    padding: "6px 12px",
                    background: themeName === tKey ? t.fg : "transparent",
                    color: themeName === tKey ? t.bg : t.fg,
                    border: "1px solid " + (themeName === tKey ? t.fg : "rgba(255,255,255,0.3)"),
                    fontFamily: "monospace",
                    fontSize: 9,
                    cursor: "pointer",
                    borderRadius: 3,
                    letterSpacing: 2,
                    fontWeight: themeName === tKey ? 700 : 400,
                  }}
                >
                  {t.name.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Restored Landing / Intro */}
          <div style={{ textAlign: "center", padding: "30px 0 10px" }}>
            <TrailForkMark size={40} theme={theme} />
            <h1 style={{ fontSize: 32, fontWeight: 900, color: theme.hi, letterSpacing: 8, margin: "0 0 4px" }}>OFFTRAILED</h1>
            <p style={{ color: theme.fg, letterSpacing: 3, fontSize: 13, margin: 0 }}>Break the loop. Find what's new.</p>
            <p style={{ color: theme.dim, fontSize: 12, marginTop: 8, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>AI-powered discovery trails for the curious.</p>
            {user && <p style={{ fontSize: 10, color: theme.acc, marginTop: 6 }}>Welcome back, {user.name}</p>}
          </div>

          <div style={{ maxWidth: 700, margin: "12px auto", padding: 8 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ ...card, flex: "1 1 220px" }}>
                <div style={{ fontSize: 12, color: theme.hi, fontWeight: 700, marginBottom: 8 }}>How It Works</div>
                <div style={{ color: theme.dim, fontSize: 12, lineHeight: 1.7 }}>
                  <p style={{ margin: "0 0 6px" }}><strong style={{ color: theme.fg }}>Set Your Trailhead:</strong> City, date, vibe, budget, and duration.</p>
                  <p style={{ margin: "0 0 6px" }}><strong style={{ color: theme.fg }}>AI Scouts the Area:</strong> Live web search finds real, current waypoints — no stale lists.</p>
                  <p style={{ margin: "0 0 6px" }}><strong style={{ color: theme.fg }}>Get Your Trail:</strong> 6-10 unique waypoints with insider tips, cost estimates, and perks at check-in.</p>
                  <p style={{ margin: 0 }}><strong style={{ color: theme.fg }}>Break the Loop:</strong> Every trail is fresh. No tourist traps. Just discoveries.</p>
                </div>
              </div>
              <div style={{ ...card, flex: "1 1 220px" }}>
                <div style={{ fontSize: 12, color: theme.hi, fontWeight: 700, marginBottom: 8 }}>Features</div>
                <ul style={{ color: theme.dim, fontSize: 12, lineHeight: 1.6, margin: 0, paddingLeft: 16 }}>
                  <li>Trail Builder — location, date, duration, vibe, budget</li>
                  <li>AI-Powered — Claude + web search for live, local results</li>
                  <li>Check-ins & incentives — redeem deals at stops</li>
                  <li>Collaboration — vote and reorder shared trails</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Builder */}
          <div style={{ ...card, padding: 24 }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: theme.hi, fontWeight: 700, marginBottom: 16 }}>BUILD YOUR TRAIL</div>
            <div style={{ marginBottom: 12 }}><label style={lbl}>TRAILHEAD</label><input value={loc} onChange={function (e) { setLoc(e.target.value); }} placeholder="Austin, Texas" style={inp} /></div>
            <div style={{ marginBottom: 12 }}><label style={{ ...lbl, color: theme.acc }}>MISSION (optional)</label><textarea value={mission} onChange={function (e) { setMission(e.target.value); }} rows={2} placeholder='"Date night" or "SXSW music day"' style={{ ...inp, resize: "none" }}></textarea></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 12 }}>
              <div><label style={lbl}>DATE</label><input type="date" value={date} onChange={function (e) { setDate(e.target.value); }} style={{ ...inp, colorScheme: "dark" }} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div><label style={lbl}>START</label><input type="time" value={startTime} onChange={function (e) { setStartTime(e.target.value); }} style={{ ...inp, colorScheme: "dark", fontSize: 12 }} /></div>
                <div><label style={lbl}>END</label><input type="time" value={endTime} onChange={function (e) { setEndTime(e.target.value); }} style={{ ...inp, colorScheme: "dark", fontSize: 12 }} /></div>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}><label style={lbl}>VIBE</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                {[["hidden-gems", "◈ Hidden Gems"], ["art-culture", "△ Art & Culture"], ["food-drink", "◇ Secret Eats"], ["nature-weird", "◎ Nature & Weird"], ["nightlife", "◐ After Dark"], ["everything", "✦ Full Spectrum"]].map(function (v) {
                  return <button key={v[0]} onClick={function () { setVibe(v[0]); }} style={{ ...sel(vibe === v[0]), textAlign: "center", padding: "8px 4px", fontSize: 10 }}>{v[1]}</button>;
                })}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}><label style={lbl}>BUDGET</label>
              <div style={{ display: "flex", gap: 4 }}>
                {["Free", "$", "$$", "$$$"].map(function (b) {
                  return <button key={b} onClick={function () { setBudget(b); }} style={{ ...sel(budget === b), flex: 1, textAlign: "center", fontWeight: 700 }}>{b}</button>;
                })}
              </div>
            </div>
            <button onClick={generate} disabled={loading} style={btn(true, { width: "100%", letterSpacing: 5, fontSize: 12, padding: 14, opacity: loading ? 0.5 : 1 })}>
              {loading ? "SCOUTING..." : "GET OFFTRAILED"}
            </button>
          </div>
        </div>
      )}

      {/* ===== RESULTS ===== */}
      {pg === "results" && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <TrailForkMark size={28} theme={theme} />
              <p style={{ fontSize: 11, color: theme.mut, letterSpacing: 3, marginTop: 12 }}>{ldMsg}</p>
            </div>
          )}
          {!loading && stops.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid " + theme.ina }}>
                <div>
                  <div style={{ fontSize: 11, color: theme.hi, fontWeight: 700, letterSpacing: 4 }}>YOUR TRAIL</div>
                  <div style={{ fontSize: 9, color: theme.mut }}>{loc} • {date} • {startTime}–{endTime} • {stops.length} stops</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={function () { var url = "https://www.google.com/maps/dir/" + stops.map(function (s) { return encodeURIComponent(s.name + ", " + loc); }).join("/"); window.open(url, "_blank"); }} style={btn(false, { padding: "4px 10px", fontSize: 9, color: theme.ac3 })}>MAP ↗</button>
                  {user && <button onClick={function () { setSaved(function (p) { return p.concat([{ id: "t" + Date.now(), title: loc + " Trail", date: date, stops: stops }]); }); }} style={btn(false, { padding: "4px 10px", fontSize: 9, color: theme.acc })}>★ SAVE</button>}
                  <button onClick={function () { setPg("home"); }} style={btn(false, { padding: "4px 10px", fontSize: 9 })}>← REROUTE</button>
                </div>
              </div>

              {stops.map(function (s, i) {
                return (
                  <div key={i} onClick={function () { setActive(active === i ? null : i); }} style={{ ...card, padding: "12px 12px 12px 40px", marginBottom: 4, position: "relative", cursor: "pointer", background: active === i ? theme.ab : theme.cbg, border: "1px solid " + (active === i ? theme.abd : theme.cbd) }}>
                    {/* Number circle */}
                    <div style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, borderRadius: "50%", background: s.checkedIn ? theme.ok : (active === i ? theme.fg : theme.cbg), border: "2px solid " + (s.checkedIn ? theme.ok : (active === i ? theme.fg : theme.mut)), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: (s.checkedIn || active === i) ? theme.bg : theme.mut }}>
                      {s.checkedIn ? "✓" : i + 1}
                    </div>
                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: theme.acc, fontWeight: 700 }}>{s.time}</span>
                      <span style={{ fontSize: 8, color: theme.mut, border: "1px solid " + theme.ina, padding: "1px 5px", borderRadius: 2, textTransform: "uppercase", letterSpacing: 2 }}>{s.category}</span>
                      {s.est_cost && <span style={{ fontSize: 8, color: theme.acc }}>{s.est_cost}</span>}
                      {s.checkedIn && <span style={{ fontSize: 8, color: theme.ok, marginLeft: "auto" }}>✓ CHECKED IN</span>}
                    </div>
                    <div style={{ fontSize: 13, color: theme.hi, fontWeight: 700, marginBottom: 3 }}>{s.name}</div>
                    <p style={{ fontSize: 11, color: theme.dim, lineHeight: 1.7, margin: 0 }}>{s.description}</p>
                    {s.incentive && <div style={{ marginTop: 6, padding: "4px 8px", background: theme.acc + "15", border: "1px solid " + theme.acc + "40", borderRadius: 3, fontSize: 9, color: theme.acc }}>🎁 {s.incentive}</div>}
                    {active === i && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid " + theme.ina }}>
                        {s.insider_tip && <p style={{ fontSize: 10, color: theme.acc, marginBottom: 6, margin: "0 0 6px" }}>💡 {s.insider_tip}</p>}
                        {!s.checkedIn ? (
                          <button onClick={function (e) { e.stopPropagation(); setStops(function (p) { return p.map(function (x, j) { return j === i ? Object.assign({}, x, { checkedIn: true }) : x; }); }); }} style={btn(true, { padding: "8px 16px", fontSize: 10, background: theme.ok, letterSpacing: 3 })}>📍 CHECK IN</button>
                        ) : (
                          <span style={{ fontSize: 10, color: theme.ok }}>📍 Checked in!{s.incentive ? " — Show for: " + s.incentive : ""}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {note && <div style={{ marginTop: 12, padding: 12, borderLeft: "3px solid " + theme.ac2, background: theme.ac2 + "08", borderRadius: 3 }}><p style={{ fontSize: 11, color: theme.ac2, lineHeight: 1.7, margin: 0 }}>{note}</p></div>}

              {/* Reroute */}
              <div style={{ ...card, marginTop: 12 }}>
                <label style={lbl}>REROUTE</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={tweak} onChange={function (e) { setTweak(e.target.value); }} placeholder="'more food' or 'swap stop 3'" style={{ ...inp, flex: 1, fontSize: 11 }} />
                  <button style={btn(true, { padding: "8px 14px", background: ACC })}>GO</button>
                </div>
              </div>

              {/* Check-in progress */}
              <div style={{ marginTop: 12, textAlign: "center", padding: 12, background: theme.ab, borderRadius: 4 }}>
                <span style={{ fontSize: 10, letterSpacing: 2 }}>{checkedCount} / {stops.length} CHECKED IN</span>
                <div style={{ width: "100%", height: 6, background: theme.ina, borderRadius: 3, marginTop: 8 }}>
                  <div style={{ height: 6, borderRadius: 3, background: theme.ok, width: (checkedCount / stops.length * 100) + "%", transition: "width 0.3s" }}></div>
                </div>
              </div>
            </div>
          )}
          {!loading && stops.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <TrailForkMark size={28} theme={theme} />
              <p style={{ fontSize: 12, color: theme.mut, letterSpacing: 3, marginTop: 12 }}>No trail yet</p>
              {note && <p style={{ fontSize: 11, color: theme.ac2, marginTop: 8 }}>{note}</p>}
              <button onClick={function () { setPg("home"); }} style={btn(false, { marginTop: 12, fontSize: 10 })}>← Back to Trailhead</button>
            </div>
          )}
        </div>
      )}

      {/* ===== PROFILE / SAVED TRAILS ===== */}
      {pg === "profile" && user && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: AB, border: "2px solid " + ABD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900 }}>{user.name[0]}</div>
            <div>
              <div style={{ fontSize: 15, color: theme.hi, fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: 10, color: theme.mut }}>{user.email}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: theme.hi, fontWeight: 700, letterSpacing: 4, marginBottom: 12 }}>★ SAVED TRAILS ({saved.length})</div>
          {saved.map(function (tr) {
            return (
              <div key={tr.id} style={{ ...card, marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: theme.hi, fontWeight: 700 }}>{tr.title}</div>
                <div style={{ fontSize: 9, color: theme.mut }}>{tr.date} • {tr.stops.length} stops</div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== COLLAB ===== */}
      {pg === "collab" && user && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
          <div style={{ fontSize: 12, color: theme.hi, fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>👥 COLLABORATIVE TRAILS</div>
          <div style={card}>
            <div style={{ fontSize: 14, color: theme.hi, fontWeight: 700, marginBottom: 4 }}>{DEMO_COLLAB.title}</div>
            <div style={{ fontSize: 9, color: theme.mut, marginBottom: 12 }}>Members: {DEMO_COLLAB.members.join(", ")}</div>
            <div style={{ fontSize: 10, color: theme.hi, letterSpacing: 3, marginBottom: 8 }}>Vote 👍👎 · Reorder ▲▼</div>
            {DEMO_COLLAB.stops.map(function (s, i) {
              var vk = "c1-" + i;
              var my = colVotes[vk];
              var up = s.votes.up + (my === "up" ? 1 : 0);
              var dn = s.votes.down + (my === "down" ? 1 : 0);
              var net = up - dn;
              return (
                <div key={i} style={{ ...card, marginBottom: 6, display: "flex", gap: 8 }}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
                    <button style={{ background: "none", border: "none", color: i > 0 ? FG : INA, cursor: "pointer", fontSize: 10, padding: 2 }}>▲</button>
                    <button style={{ background: "none", border: "none", color: i < 3 ? FG : INA, cursor: "pointer", fontSize: 10, padding: 2 }}>▼</button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: theme.acc, fontWeight: 700 }}>{s.time}</span>
                      <span style={{ fontSize: 12, color: theme.hi, fontWeight: 700 }}>{s.name}</span>
                    </div>
                    <p style={{ fontSize: 10, color: theme.dim, lineHeight: 1.7, margin: "0 0 8px" }}>{s.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={function () { setColVotes(function (p) { var n = Object.assign({}, p); n[vk] = n[vk] === "up" ? null : "up"; return n; }); }} style={{ background: my === "up" ? OK + "20" : "transparent", border: "1px solid " + (my === "up" ? OK : INA), borderRadius: 3, padding: "3px 10px", cursor: "pointer" }}>
                        👍 <span style={{ fontSize: 10, color: theme.ok, fontWeight: 700 }}>{up}</span>
                      </button>
                      <button onClick={function () { setColVotes(function (p) { var n = Object.assign({}, p); n[vk] = n[vk] === "down" ? null : "down"; return n; }); }} style={{ background: my === "down" ? AC2 + "20" : "transparent", border: "1px solid " + (my === "down" ? AC2 : INA), borderRadius: 3, padding: "3px 10px", cursor: "pointer" }}>
                        👎 <span style={{ fontSize: 10, color: theme.ac2, fontWeight: 700 }}>{dn}</span>
                      </button>
                      <span style={{ fontSize: 9, color: theme.mut, marginLeft: "auto" }}>NET: <span style={{ color: net > 0 ? theme.ok : net < 0 ? theme.ac2 : theme.mut, fontWeight: 700 }}>{net > 0 ? "+" : ""}{net}</span></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== BUSINESS DASHBOARD ===== */}
      {pg === "biz" && user && user.type === "business" && (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
          <div style={{ fontSize: 12, color: theme.hi, fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>📊 {user.name.toUpperCase()} DASHBOARD</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[["PROPOSED", "847", FG], ["CHECK-INS", "312", OK], ["CONVERSION", "36.8%", ACC]].map(function (m) {
              return (
                <div key={m[0]} style={{ ...card, textAlign: "center" }}>
                  <div style={{ fontSize: 24, color: m[2], fontWeight: 900 }}>{m[1]}</div>
                  <div style={{ fontSize: 8, color: theme.mut, letterSpacing: 3, marginTop: 4 }}>{m[0]}</div>
                </div>
              );
            })}
          </div>
          <div style={card}>
            <div style={{ fontSize: 11, color: theme.hi, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>🎁 INCENTIVE MANAGER</div>
            {deals.map(function (d) {
              return (
                <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid " + INA }}>
                  <div>
                    <div style={{ fontSize: 11, color: theme.hi }}>{d.text}</div>
                    <div style={{ fontSize: 9, color: theme.mut }}>{d.ct} redemptions</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, color: d.on ? OK : AC2 }}>{d.on ? "ON" : "OFF"}</span>
                    <button onClick={function () { setDeals(function (p) { return p.map(function (x) { return x.id === d.id ? Object.assign({}, x, { on: !x.on }) : x; }); }); }} style={btn(false, { padding: "3px 8px", fontSize: 8 })}>{d.on ? "PAUSE" : "ON"}</button>
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input value={newDeal} onChange={function (e) { setNewDeal(e.target.value); }} placeholder="New deal..." style={{ ...inp, flex: 1, fontSize: 11 }} />
              <button onClick={function () { if (newDeal.trim()) { setDeals(function (p) { return p.concat([{ id: Date.now() + "", text: newDeal, on: true, ct: 0 }]); }); setNewDeal(""); } }} style={btn(true, { padding: "8px 14px", fontSize: 10 })}>ADD</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADMIN ===== */}
      {pg === "admin" && user && user.type === "admin" && (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
          <div style={{ fontSize: 12, color: theme.hi, fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>⚡ ADMIN — ALGORITHM CONTROL</div>
          <div style={{...card, marginBottom: 12, padding: 12, background: ABD + "15", border: "1px solid " + ABD}}>
            <div style={{ fontSize: 10, color: theme.dim, lineHeight: 1.6 }}>Highlight or lowlight specific businesses in trail recommendations. Active controls are included in each trail request.</div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 11, color: theme.hi, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>ACTIVE CONTROLS</div>
            {boosts.length === 0 ? (
              <p style={{ color: theme.mut, fontSize: 10, textAlign: "center", margin: 0 }}>No controls yet. Add one below.</p>
            ) : (
              boosts.map(function (b) {
                var isHighlight = b.type === "highlight";
                return (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid " + INA }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                      <span style={{ fontSize: 16, color: isHighlight ? OK : AC2 }}>{isHighlight ? "↗" : "↙"}</span>
                      <div>
                        <div style={{ color: theme.hi, fontWeight: 700, fontSize: 12 }}>{b.name}</div>
                        <div style={{ color: theme.mut, fontSize: 9, letterSpacing: 1 }}>{isHighlight ? "HIGHLIGHT" : "LOWLIGHT"} · {b.pct}%</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 9, color: b.on ? (isHighlight ? OK : AC2) : MUT, fontWeight: 700 }}>{b.on ? "ACTIVE" : "OFF"}</span>
                      <button onClick={function () { setBoosts(function (p) { return p.map(function (x) { return x.id === b.id ? Object.assign({}, x, { on: !x.on }) : x; }); }); }} style={btn(false, { padding: "3px 8px", fontSize: 8 })}>{b.on ? "OFF" : "ON"}</button>
                      <button onClick={function () { setBoosts(function (p) { return p.filter(function (x) { return x.id !== b.id; }); }); }} style={btn(false, { padding: "3px 8px", fontSize: 8, color: theme.ac2 })}>DEL</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div style={{ ...card, marginTop: 12 }}>
            <div style={{ fontSize: 11, color: theme.hi, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>+ ADD CONTROL</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><label style={lbl}>BUSINESS NAME</label><input value={bName} onChange={function (e) { setBName(e.target.value); }} placeholder="e.g., Coffee Haus" style={inp} /></div>
              <div><label style={lbl}>TYPE</label><div style={{ display: "flex", gap: 4 }}>{["highlight", "lowlight"].map(function (t) { return <button key={t} onClick={function () { setBType(t); }} style={{ ...sel(bType === t), flex: 1, textAlign: "center", fontSize: 9, textTransform: "capitalize" }}>{t}</button>; })}</div></div>
              <div><label style={lbl}>POWER %</label><input type="number" value={bPct} onChange={function (e) { setBPct(e.target.value); }} min="1" max="100" style={inp} /></div>
            </div>
            <button onClick={function () { if (bName.trim()) { setBoosts(function (p) { return p.concat([{ id: Date.now() + "", name: bName, type: bType, pct: parseInt(bPct) || 15, on: true }]); }); setBName(""); setBType("highlight"); setBPct("15"); } }} style={btn(true, { width: "100%", letterSpacing: 3 })}>ADD CONTROL</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
            {[["TRAILS", "1,247"], ["USERS", "823"], ["PARTNERS", "34"]].map(function (m) {
              return <div key={m[0]} style={{ ...card, textAlign: "center" }}><div style={{ fontSize: 20, color: theme.acc, fontWeight: 900 }}>{m[1]}</div><div style={{ fontSize: 8, color: theme.mut, letterSpacing: 3, marginTop: 3 }}>{m[0]}</div></div>;
            })}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "40px 0 20px", marginTop: 40, borderTop: "1px solid " + INA }}>
        <TrailForkMark size={14} theme={theme} />
        <div style={{ fontSize: 9, color: theme.mut, letterSpacing: 5, marginTop: 4 }}>OFFTRAILED v3</div>
        <div style={{ fontSize: 8, color: theme.mut, opacity: 0.5, marginTop: 4 }}>The boring path fades. The novel path leads to discovery.</div>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: ${MUT}; }
        input:focus, textarea:focus { border-color: ${FG} !important; }
        select option { background: ${BG} !important; color: ${FG} !important; }
      `}</style>
    </div>
  );
}
