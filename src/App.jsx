import { useState, useEffect } from "react";

const BG = "#0e1a12";
const FG = "#8fbc6a";
const HI = "#d4f0c0";
const DIM = "rgba(143,188,106,0.6)";
const MUT = "rgba(143,188,106,0.45)";
const ACC = "#e8a835";
const AC2 = "#d45a3a";
const AC3 = "#6ab8d4";
const OK = "#6abf5a";
const CBG = "rgba(143,188,106,0.03)";
const CBD = "rgba(143,188,106,0.12)";
const AB = "rgba(143,188,106,0.08)";
const ABD = "rgba(143,188,106,0.35)";
const INA = "rgba(143,188,106,0.1)";
const IBG = "rgba(143,188,106,0.04)";
const IBD = "rgba(143,188,106,0.2)";
const SRF = "rgba(14,26,18,0.94)";

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

// Styles
const inp = { width: "100%", background: IBG, border: "1px solid " + IBD, color: FG, fontFamily: "monospace", fontSize: 13, padding: "10px 12px", outline: "none", borderRadius: 3, boxSizing: "border-box" };
const lbl = { fontSize: 9, letterSpacing: 3, color: DIM, fontFamily: "monospace", display: "block", marginBottom: 6 };
const card = { background: CBG, border: "1px solid " + CBD, borderRadius: 4, padding: 16 };

function btn(pri, extra) {
  return { background: pri ? FG : "transparent", color: pri ? BG : FG, border: pri ? "none" : "1px solid " + INA, fontFamily: "monospace", fontSize: 11, padding: "10px 20px", cursor: "pointer", borderRadius: 3, letterSpacing: 2, fontWeight: pri ? 700 : 400, ...(extra || {}) };
}
function sel(active) {
  return { background: active ? AB : CBG, border: "1px solid " + (active ? ABD : INA), color: active ? FG : MUT, fontFamily: "monospace", cursor: "pointer", borderRadius: 3, padding: "6px 8px", fontSize: 10 };
}

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
  var [pg, setPg] = useState("home");
  var [user, setUser] = useState(null);
  var [email, setEmail] = useState("demo@offtrailed.com");
  var [pw, setPw] = useState("trail123");
  var [authErr, setAuthErr] = useState("");
  var [showAuth, setShowAuth] = useState(false);

  // Builder
  var [loc, setLoc] = useState("Austin, Texas");
  var [date, setDate] = useState("2026-02-09");
  var [vibe, setVibe] = useState("hidden-gems");
  var [budget, setBudget] = useState("$$");
  var [duration, setDuration] = useState("half");
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

  // Admin
  var [boosts, setBoosts] = useState([
    { id: "1", name: "Coffee Haus", pct: 15, on: true },
    { id: "2", name: "Museum of the Weird", pct: 10, on: true },
  ]);
  var [bName, setBName] = useState("");
  var [bPct, setBPct] = useState("10");

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
      var query = (mission ? "Focus on: " + mission + "\n" : "") + "Itinerary for " + loc + " on " + date + ", duration: " + duration + " day, vibe: " + vibe + ", budget: " + budget + ". " + (duration === "couple" ? "3-4" : duration === "half" ? "4-5" : duration === "full" ? "6-8" : "8-10") + " real stops.\nJSON: {\"stops\":[{\"time\":\"10 AM\",\"name\":\"N\",\"category\":\"food\",\"description\":\"Desc\",\"insider_tip\":\"Tip\",\"est_cost\":\"$10\"}],\"trail_note\":\"Note\",\"total_est_cost\":\"$X\"}";
      var res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
      });
      var data;
      try {
        data = await res.json();
      } catch (err) {
        var text = await res.text();
        var stripped = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        setNote("Agent returned non-JSON response: " + (stripped || text).slice(0,1000));
        setLoading(false);
        return;
      }
      if (!data) { setNote("No response from agent"); setLoading(false); return; }
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
      setNote("Error: " + e.message);
    }
    setLoading(false);
  }

  // Nav helper
  function navBtn(target, label) {
    return (
      <button key={target} onClick={function () { setPg(target); }} style={{ background: pg === target ? AB : "transparent", border: "1px solid " + (pg === target ? ABD : "transparent"), color: pg === target ? FG : MUT, fontFamily: "monospace", fontSize: 8, padding: "4px 8px", cursor: "pointer", borderRadius: 3, letterSpacing: 2 }}>{label}</button>
    );
  }

  var checkedCount = stops.filter(function (s) { return s.checkedIn; }).length;

  return (
    <div style={{ background: BG, color: FG, minHeight: "100vh", fontFamily: "'Courier New', monospace" }}>

      {/* ===== HEADER ===== */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, padding: "8px 12px", background: SRF, borderBottom: "1px solid " + CBD, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={function () { setPg("home"); }}>
          <span style={{ fontSize: 16 }}>↗</span>
          <span style={{ fontSize: 11, letterSpacing: 5, color: HI, fontWeight: 700 }}>OFFTRAILED</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {user && user.type === "user" && (
            <span>{navBtn("home", "HOME")}{navBtn("profile", "TRAILS")}{navBtn("collab", "COLLAB")}</span>
          )}
          {user && user.type === "business" && navBtn("biz", "DASHBOARD")}
          {user && user.type === "admin" && navBtn("admin", "ADMIN")}
          {user ? (
            <span style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: AB, border: "1px solid " + ABD, fontSize: 8, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{user.name[0]}</span>
              <button onClick={function () { setUser(null); setPg("home"); }} style={{ fontSize: 8, color: MUT, background: "none", border: "none", cursor: "pointer", fontFamily: "monospace" }}>OUT</button>
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
            <div style={{ fontSize: 10, letterSpacing: 3, color: HI, fontWeight: 700, marginBottom: 12 }}>SIGN IN</div>
            <div style={{ marginBottom: 8 }}><label style={lbl}>EMAIL</label><input value={email} onChange={function (e) { setEmail(e.target.value); }} style={inp} /></div>
            <div style={{ marginBottom: 8 }}><label style={lbl}>PASSWORD</label><input type="password" value={pw} onChange={function (e) { setPw(e.target.value); }} style={inp} /></div>
            {authErr && <p style={{ fontSize: 10, color: AC2, marginBottom: 6 }}>{authErr}</p>}
            <button onClick={login} style={btn(true, { width: "100%", marginBottom: 10 })}>↗ SIGN IN</button>
            <div style={{ borderTop: "1px solid " + INA, paddingTop: 8 }}>
              <p style={{ fontSize: 8, color: MUT, textAlign: "center", letterSpacing: 2, marginBottom: 6 }}>DEMO ACCOUNTS (click to fill)</p>
              {[["demo@offtrailed.com", "trail123", "🧭 Explorer"], ["biz@coffeehaus.com", "biz123", "☕ Business"], ["admin@offtrailed.com", "admin123", "⚡ Admin"]].map(function (a) {
                return (
                  <button key={a[0]} onClick={function () { setEmail(a[0]); setPw(a[1]); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "5px 8px", marginBottom: 3, background: email === a[0] ? AB : "transparent", border: "1px solid " + (email === a[0] ? ABD : INA), borderRadius: 3, cursor: "pointer", color: FG, fontFamily: "monospace", fontSize: 9 }}>
                    {a[2]} — <span style={{ color: MUT, fontSize: 8 }}>{a[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== HOME / TRAIL BUILDER ===== */}
      {pg === "home" && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
          {/* Restored Landing / Intro */}
          <div style={{ textAlign: "center", padding: "30px 0 10px" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>↗</div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: HI, letterSpacing: 8, margin: "0 0 4px" }}>OFFTRAILED</h1>
            <p style={{ color: FG, letterSpacing: 3, fontSize: 13, margin: 0 }}>Break the loop. Find what's new.</p>
            <p style={{ color: DIM, fontSize: 12, marginTop: 8, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>AI-powered discovery trails that help you find novel, underrated local experiences. No tourist traps.</p>
            {user && <p style={{ fontSize: 10, color: ACC, marginTop: 6 }}>Welcome back, {user.name}</p>}
          </div>

          <div style={{ maxWidth: 700, margin: "12px auto", padding: 8 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ ...card, flex: "1 1 220px" }}>
                <div style={{ fontSize: 12, color: HI, fontWeight: 700, marginBottom: 8 }}>How It Works</div>
                <div style={{ color: DIM, fontSize: 12, lineHeight: 1.7 }}>
                  <p style={{ margin: "0 0 6px" }}><strong style={{ color: FG }}>Pick Your Parameters:</strong> City, date, vibe (hidden gems, food, art, nightlife), budget, and duration.</p>
                  <p style={{ margin: "0 0 6px" }}><strong style={{ color: FG }}>AI Scouts Live:</strong> Claude runs web searches in real-time to find current, verified stops — no stale lists.</p>
                  <p style={{ margin: "0 0 6px" }}><strong style={{ color: FG }}>Get Your Trail:</strong> 6-10 unique stops with insider tips, cost estimates, and business perks waiting at check-in.</p>
                  <p style={{ margin: 0 }}><strong style={{ color: FG }}>Break the Loop:</strong> Every trail is fresh. No tourist traps. Just discoveries.</p>
                </div>
              </div>
              <div style={{ ...card, flex: "1 1 220px" }}>
                <div style={{ fontSize: 12, color: HI, fontWeight: 700, marginBottom: 8 }}>Features</div>
                <ul style={{ color: DIM, fontSize: 12, lineHeight: 1.6, margin: 0, paddingLeft: 16 }}>
                  <li>Trail Builder — location, date, duration, vibe, budget</li>
                  <li>AI-Powered — Claude + web search for live, local results</li>
                  <li>Check-ins & incentives — redeem deals at stops</li>
                  <li>Collaboration — vote and reorder shared trails</li>
                </ul>
              </div>
              <div style={{ ...card, flex: "1 1 220px" }}>
                <div style={{ fontSize: 12, color: HI, fontWeight: 700, marginBottom: 8 }}>Demo Accounts</div>
                <div style={{ color: DIM, fontSize: 12 }}>
                  <div>demo@offtrailed.com / trail123</div>
                  <div>biz@coffeehaus.com / biz123</div>
                  <div>admin@offtrailed.com / admin123</div>
                </div>
              </div>
            </div>
          </div>

          {/* Builder */}
          <div style={{ ...card, padding: 24 }}>
            <div style={{ fontSize: 12, letterSpacing: 4, color: HI, fontWeight: 700, marginBottom: 16 }}>↗ BUILD YOUR TRAIL</div>
            <div style={{ marginBottom: 12 }}><label style={lbl}>TRAILHEAD</label><input value={loc} onChange={function (e) { setLoc(e.target.value); }} placeholder="Austin, Texas" style={inp} /></div>
            <div style={{ marginBottom: 12 }}><label style={{ ...lbl, color: ACC }}>MISSION (optional)</label><textarea value={mission} onChange={function (e) { setMission(e.target.value); }} rows={2} placeholder='"Date night" or "SXSW music day"' style={{ ...inp, resize: "none" }}></textarea></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><label style={lbl}>DATE</label><input type="date" value={date} onChange={function (e) { setDate(e.target.value); }} style={{ ...inp, colorScheme: "dark" }} /></div>
              <div><label style={lbl}>TIME</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  {[["couple", "2-3 hrs"], ["half", "Half Day"], ["full", "Full Day"], ["overnight", "Overnight"]].map(function (d) {
                    return <button key={d[0]} onClick={function () { setDuration(d[0]); }} style={{ ...sel(duration === d[0]), textAlign: "center", fontSize: 9 }}>{d[1]}</button>;
                  })}
                </div>
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
              {loading ? "↗ SCOUTING..." : "↗ GET OFFTRAILED ↗"}
            </button>
          </div>
        </div>
      )}

      {/* ===== RESULTS ===== */}
      {pg === "results" && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 32 }}>↗</div>
              <p style={{ fontSize: 11, color: MUT, letterSpacing: 3, marginTop: 12 }}>{ldMsg}</p>
            </div>
          )}
          {!loading && stops.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid " + INA }}>
                <div>
                  <div style={{ fontSize: 11, color: HI, fontWeight: 700, letterSpacing: 4 }}>YOUR TRAIL</div>
                  <div style={{ fontSize: 9, color: MUT }}>{loc} • {date} • {duration === "couple" ? "2-3 hrs" : duration === "half" ? "Half day" : duration === "full" ? "Full day" : "Overnight"} • {stops.length} stops</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {user && <button onClick={function () { setSaved(function (p) { return p.concat([{ id: "t" + Date.now(), title: loc + " Trail", date: date, stops: stops }]); }); }} style={btn(false, { padding: "4px 10px", fontSize: 9, color: ACC })}>★ SAVE</button>}
                  <button onClick={function () { setPg("home"); }} style={btn(false, { padding: "4px 10px", fontSize: 9 })}>← EDIT</button>
                </div>
              </div>

              {stops.map(function (s, i) {
                return (
                  <div key={i} onClick={function () { setActive(active === i ? null : i); }} style={{ ...card, padding: "12px 12px 12px 40px", marginBottom: 4, position: "relative", cursor: "pointer", background: active === i ? AB : CBG, border: "1px solid " + (active === i ? ABD : CBD) }}>
                    {/* Number circle */}
                    <div style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, borderRadius: "50%", background: s.checkedIn ? OK : (active === i ? FG : CBG), border: "2px solid " + (s.checkedIn ? OK : (active === i ? FG : MUT)), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: (s.checkedIn || active === i) ? BG : MUT }}>
                      {s.checkedIn ? "✓" : i + 1}
                    </div>
                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: ACC, fontWeight: 700 }}>{s.time}</span>
                      <span style={{ fontSize: 8, color: MUT, border: "1px solid " + INA, padding: "1px 5px", borderRadius: 2, textTransform: "uppercase", letterSpacing: 2 }}>{s.category}</span>
                      {s.est_cost && <span style={{ fontSize: 8, color: ACC }}>{s.est_cost}</span>}
                      {s.checkedIn && <span style={{ fontSize: 8, color: OK, marginLeft: "auto" }}>✓ CHECKED IN</span>}
                    </div>
                    <div style={{ fontSize: 13, color: HI, fontWeight: 700, marginBottom: 3 }}>{s.name}</div>
                    <p style={{ fontSize: 11, color: DIM, lineHeight: 1.7, margin: 0 }}>{s.description}</p>
                    {s.incentive && <div style={{ marginTop: 6, padding: "4px 8px", background: ACC + "15", border: "1px solid " + ACC + "40", borderRadius: 3, fontSize: 9, color: ACC }}>🎁 {s.incentive}</div>}
                    {active === i && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid " + INA }}>
                        {s.insider_tip && <p style={{ fontSize: 10, color: ACC, marginBottom: 6, margin: "0 0 6px" }}>💡 {s.insider_tip}</p>}
                        {!s.checkedIn ? (
                          <button onClick={function (e) { e.stopPropagation(); setStops(function (p) { return p.map(function (x, j) { return j === i ? Object.assign({}, x, { checkedIn: true }) : x; }); }); }} style={btn(true, { padding: "8px 16px", fontSize: 10, background: OK, letterSpacing: 3 })}>📍 CHECK IN</button>
                        ) : (
                          <span style={{ fontSize: 10, color: OK }}>📍 Checked in!{s.incentive ? " — Show for: " + s.incentive : ""}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {note && <div style={{ marginTop: 12, padding: 12, borderLeft: "3px solid " + AC2, background: AC2 + "08", borderRadius: 3 }}><p style={{ fontSize: 11, color: AC2, lineHeight: 1.7, margin: 0 }}>{note}</p></div>}

              {/* Reroute */}
              <div style={{ ...card, marginTop: 12 }}>
                <label style={lbl}>↗ REROUTE</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={tweak} onChange={function (e) { setTweak(e.target.value); }} placeholder="'more food' or 'swap stop 3'" style={{ ...inp, flex: 1, fontSize: 11 }} />
                  <button style={btn(true, { padding: "8px 14px", background: ACC })}>GO</button>
                </div>
              </div>

              {/* Check-in progress */}
              <div style={{ marginTop: 12, textAlign: "center", padding: 12, background: AB, borderRadius: 4 }}>
                <span style={{ fontSize: 10, letterSpacing: 2 }}>{checkedCount} / {stops.length} CHECKED IN</span>
                <div style={{ width: "100%", height: 6, background: INA, borderRadius: 3, marginTop: 8 }}>
                  <div style={{ height: 6, borderRadius: 3, background: OK, width: (checkedCount / stops.length * 100) + "%", transition: "width 0.3s" }}></div>
                </div>
              </div>
            </div>
          )}
          {!loading && stops.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 32 }}>↗</div>
              {note && <p style={{ fontSize: 11, color: AC2, marginTop: 12 }}>{note}</p>}
              <button onClick={function () { setPg("home"); }} style={btn(false, { marginTop: 12, fontSize: 10 })}>← Home</button>
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
              <div style={{ fontSize: 15, color: HI, fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: 10, color: MUT }}>{user.email}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: HI, fontWeight: 700, letterSpacing: 4, marginBottom: 12 }}>★ SAVED TRAILS ({saved.length})</div>
          {saved.map(function (tr) {
            return (
              <div key={tr.id} style={{ ...card, marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: HI, fontWeight: 700 }}>{tr.title}</div>
                <div style={{ fontSize: 9, color: MUT }}>{tr.date} • {tr.stops.length} stops</div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== COLLAB ===== */}
      {pg === "collab" && user && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
          <div style={{ fontSize: 12, color: HI, fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>👥 COLLABORATIVE TRAILS</div>
          <div style={card}>
            <div style={{ fontSize: 14, color: HI, fontWeight: 700, marginBottom: 4 }}>{DEMO_COLLAB.title}</div>
            <div style={{ fontSize: 9, color: MUT, marginBottom: 12 }}>Members: {DEMO_COLLAB.members.join(", ")}</div>
            <div style={{ fontSize: 10, color: HI, letterSpacing: 3, marginBottom: 8 }}>Vote 👍👎 · Reorder ▲▼</div>
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
                      <span style={{ fontSize: 10, color: ACC, fontWeight: 700 }}>{s.time}</span>
                      <span style={{ fontSize: 12, color: HI, fontWeight: 700 }}>{s.name}</span>
                    </div>
                    <p style={{ fontSize: 10, color: DIM, lineHeight: 1.7, margin: "0 0 8px" }}>{s.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={function () { setColVotes(function (p) { var n = Object.assign({}, p); n[vk] = n[vk] === "up" ? null : "up"; return n; }); }} style={{ background: my === "up" ? OK + "20" : "transparent", border: "1px solid " + (my === "up" ? OK : INA), borderRadius: 3, padding: "3px 10px", cursor: "pointer" }}>
                        👍 <span style={{ fontSize: 10, color: OK, fontWeight: 700 }}>{up}</span>
                      </button>
                      <button onClick={function () { setColVotes(function (p) { var n = Object.assign({}, p); n[vk] = n[vk] === "down" ? null : "down"; return n; }); }} style={{ background: my === "down" ? AC2 + "20" : "transparent", border: "1px solid " + (my === "down" ? AC2 : INA), borderRadius: 3, padding: "3px 10px", cursor: "pointer" }}>
                        👎 <span style={{ fontSize: 10, color: AC2, fontWeight: 700 }}>{dn}</span>
                      </button>
                      <span style={{ fontSize: 9, color: MUT, marginLeft: "auto" }}>NET: <span style={{ color: net > 0 ? OK : net < 0 ? AC2 : MUT, fontWeight: 700 }}>{net > 0 ? "+" : ""}{net}</span></span>
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
          <div style={{ fontSize: 12, color: HI, fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>📊 {user.name.toUpperCase()} DASHBOARD</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[["PROPOSED", "847", FG], ["CHECK-INS", "312", OK], ["CONVERSION", "36.8%", ACC]].map(function (m) {
              return (
                <div key={m[0]} style={{ ...card, textAlign: "center" }}>
                  <div style={{ fontSize: 24, color: m[2], fontWeight: 900 }}>{m[1]}</div>
                  <div style={{ fontSize: 8, color: MUT, letterSpacing: 3, marginTop: 4 }}>{m[0]}</div>
                </div>
              );
            })}
          </div>
          <div style={card}>
            <div style={{ fontSize: 11, color: HI, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>🎁 INCENTIVE MANAGER</div>
            {deals.map(function (d) {
              return (
                <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid " + INA }}>
                  <div>
                    <div style={{ fontSize: 11, color: HI }}>{d.text}</div>
                    <div style={{ fontSize: 9, color: MUT }}>{d.ct} redemptions</div>
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
          <div style={{ fontSize: 12, color: HI, fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>⚡ ADMIN — ALGORITHM BOOSTS</div>
          <div style={card}>
            {boosts.map(function (b) {
              return (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid " + INA }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: HI, fontWeight: 700 }}>{b.name}</span>
                    <span style={{ color: ACC, fontWeight: 900 }}>+{b.pct}%</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, color: b.on ? OK : AC2 }}>{b.on ? "ON" : "OFF"}</span>
                    <button onClick={function () { setBoosts(function (p) { return p.map(function (x) { return x.id === b.id ? Object.assign({}, x, { on: !x.on }) : x; }); }); }} style={btn(false, { padding: "3px 8px", fontSize: 8 })}>{b.on ? "OFF" : "ON"}</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ ...card, marginTop: 12 }}>
            <div style={{ fontSize: 11, color: HI, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>+ ADD BOOST</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><label style={lbl}>SPOT NAME</label><input value={bName} onChange={function (e) { setBName(e.target.value); }} style={inp} /></div>
              <div><label style={lbl}>BOOST %</label><input type="number" value={bPct} onChange={function (e) { setBPct(e.target.value); }} style={inp} /></div>
            </div>
            <button onClick={function () { if (bName.trim()) { setBoosts(function (p) { return p.concat([{ id: Date.now() + "", name: bName, pct: parseInt(bPct) || 10, on: true }]); }); setBName(""); } }} style={btn(true, { width: "100%", letterSpacing: 3 })}>↗ ADD BOOST</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
            {[["TRAILS", "1,247"], ["USERS", "823"], ["PARTNERS", "34"]].map(function (m) {
              return <div key={m[0]} style={{ ...card, textAlign: "center" }}><div style={{ fontSize: 20, color: ACC, fontWeight: 900 }}>{m[1]}</div><div style={{ fontSize: 8, color: MUT, letterSpacing: 3, marginTop: 3 }}>{m[0]}</div></div>;
            })}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "40px 0 20px", marginTop: 40, borderTop: "1px solid " + INA }}>
        <div style={{ fontSize: 16, marginBottom: 4 }}>↗</div>
        <div style={{ fontSize: 9, color: MUT, letterSpacing: 5 }}>OFFTRAILED v3</div>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: ${MUT}; }
        input:focus, textarea:focus { border-color: ${FG} !important; }
        select option { background: ${BG} !important; color: ${FG} !important; }
      `}</style>
    </div>
  );
}
