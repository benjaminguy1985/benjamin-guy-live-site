import React, { useEffect, useState } from "react";

// NOTE: Self‑contained file for canvas preview. No external UI libs, no Head/Helmet.
// When exporting to Next.js, we can add <Head> (favicon, Open Graph), fonts, etc.

// ---------------- Mini UI (local, tailwind-only) ----------------
function ButtonBase({ href, children, variant = "primary", size = "md", className = "", ...rest }: any) {
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-2.5 text-base",
  };
  const variants: Record<string, string> = {
    primary: "bg-white text-slate-900 hover:bg-white/90",
    secondary: "bg-white/10 text-white hover:bg-white/15",
    outline: "border border-white/20 text-white hover:bg-white/5",
  };
  const cls = `rounded-2xl transition ${sizes[size]} ${variants[variant]} ${className}`;
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>;
  return <button className={cls} {...rest}>{children}</button>;
}
const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white/5 border border-white/10 rounded-3xl ${className}`}>{children}</div>
);
const CardHeader = ({ children }: any) => <div className="px-5 pt-5">{children}</div>;
const CardTitle = ({ children, className = "" }: any) => <h3 className={`text-lg ${className}`}>{children}</h3>;
const CardContent = ({ children, className = "" }: any) => <div className={`px-5 pb-5 ${className}`}>{children}</div>;
const Input = (props: any) => <input {...props} className={`w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-white/30 ${props.className||""}`} />
const Textarea = (props: any) => <textarea {...props} className={`w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-white/30 ${props.className||""}`} />

// ---------------- Theme System ----------------
const THEMES = {
  ocean: {
    name: "Ocean",
    bg: "from-slate-950 via-slate-900 to-slate-950",
    accentFrom: "from-cyan-300",
    accentTo: "to-emerald-300",
    glow: "bg-[radial-gradient(60%_60%_at_50%_10%,rgba(56,189,248,0.18),transparent_60%)]",
    themeColor: "#0f172a",
  },
  sunset: {
    name: "Sunset",
    bg: "from-slate-950 via-slate-900 to-slate-950",
    accentFrom: "from-rose-300",
    accentTo: "to-amber-200",
    glow: "bg-[radial-gradient(60%_60%_at_50%_10%,rgba(251,113,133,0.18),transparent_60%)]",
    themeColor: "#0f172a",
  },
  neon: {
    name: "Neon",
    bg: "from-slate-950 via-slate-900 to-slate-950",
    accentFrom: "from-fuchsia-300",
    accentTo: "to-cyan-300",
    glow: "bg-[radial-gradient(60%_60%_at_50%_10%,rgba(217,70,239,0.20),transparent_60%)]",
    themeColor: "#0f172a",
  },
};

const THEME_STOPS: Record<string, { from: string; to: string }> = {
  ocean: { from: "#67e8f9", to: "#6ee7b7" },
  sunset: { from: "#fda4af", to: "#fde68a" },
  neon: { from: "#f0abfc", to: "#67e8f9" },
};

// ---------------- Logo: full wordmark paths ----------------
const LOGO_SVG_PATHS: string[] = [
  "M199.05,17.61c13.09,5.76,21.78,17.07,20.93,26.63-24.93,14.24-46.5,32.93-64.57,55.67-18,22.65-31.13,47.85-40.06,75.63C96.92,118.6,62.14,74.79,10.9,44.2c-1.84-7.88,5.59-20.71,18.98-27.54,37.36,20.38,68,47.56,85.39,88.54,17.23-40.2,47.09-67.33,83.78-87.6Z",
  "M103.98,243.9c-31.4-19.83-56-45.93-74.34-77.88C11.43,134.27,1.36,100.08,0,63.23c27.85,15.59,50.4,36.83,68.29,63.07,24.15,35.41,34.92,74.95,35.68,117.6Z",
  "M230.7,63.11c-1.03,32.01-8.99,62.15-23.18,90.6-18.64,37.38-45.58,67.45-80.89,90.19.27-33.33,7.24-65.08,22.35-94.81,18.65-36.7,45.85-65.42,81.72-85.99Z",
  "M56.57,6.35c38.78-8.93,77.29-8.33,115.85,1.12-23.51,14.66-43.78,32.31-57.11,57.75-13.64-26.01-34.56-43.96-58.75-58.87Z",
  "M765.9,45.27h28.72c6.27,9.16,12.74,18.61,20.22,29.53,7.3-10.72,13.73-20.16,20.22-29.7h28.74v152.92h-25.99v-107.42c-.86-.34-1.72-.67-2.58-1.01-6.45,9.25-12.9,18.51-20.3,29.11-7.34-10.37-13.95-19.72-20.57-29.07-.73.24-1.46.48-2.19.72v107.74h-26.27V45.27Z",
  "M990.76,198.27c-11.48-24.39-22.88-48.64-34.29-72.88-.87.16-1.75.33-2.62.49-.4,23.9.81,47.84.67,72.37h-25.12V45.45h21.21c11.04,25.81,22.28,52.06,33.51,78.31.87-.14,1.74-.28,2.6-.43.95-25.66-.97-51.39-.18-77.85h23.17c2.26,6.27,2.86,141.87.56,152.78h-19.5Z",
  "M474.82,45.27h21.08c10.88,25.52,21.94,51.44,33,77.36.91-.18,1.82-.37,2.73-.55,1.79-25.31-1.19-50.79.32-76.76h24.16v152.72h-20.17c-10.88-23.14-22-46.79-33.11-70.45-.75.21-1.5.42-2.25.63-3.36,7.02-1.02,14.64-1.27,21.94-.27,7.99.35,16,.45,24,.1,7.66.02,15.33.02,23.85h-24.96V45.27Z",
  "M280.32,45.36c3.81-.3,6.39-.66,8.97-.67,11.56-.06,23.11-.13,34.67.01,17.72.21,30.64,8.73,38.46,24.21,7.86,15.56,6.68,30.94-3.84,45.23-1.23,1.67-2.51,3.29-3.74,4.96-.16.22-.16.56-.49,1.83,1.36,2.09,3.19,4.69,4.82,7.42,9.11,15.25,9.79,31.05,1.36,46.56-8.43,15.52-22.02,23.65-39.85,23.92-12.98.2-25.97.04-40.29.04-.87-51.58.22-102.27-.08-153.51ZM306.92,171.04c14.75,3.14,23.68.71,29.02-7.3,4.42-6.65,4.43-15.26.01-21.77-5.58-8.22-14.51-10.58-28.23-7.23-.24,1.22-.75,2.62-.76,4.03-.07,10.63-.04,21.27-.04,32.28ZM307.46,106.83c4.41,0,7.63.02,10.86,0,2.37-.02,4.77.11,7.1-.21,8.07-1.11,14.34-8.14,14.85-16.44.51-8.32-4.76-16.84-12.63-18.12-6.47-1.05-13.24-.21-20.19-.21v34.99Z",
  "M1220.46,45.24h25.72c.29,2.67.79,5.2.8,7.74.15,34.35.29,68.7.3,103.05,0,15.57-6.17,28.33-19.08,37.13-13.56,9.24-28.24,10.5-42.92,2.88-15.83-8.22-24.04-21.81-24.22-39.55-.29-29.02.05-58.04.11-87.06.02-7.9,0-15.79,0-24.21h26.07c.2,3.64.55,7.05.56,10.46.05,31.69,0,63.38.09,95.06.01,3.82.17,7.76,1.1,11.43,1.78,7.01,8.12,11.79,14.87,11.91,6.74.12,13.32-4.44,15.25-11.4,1.08-3.92,1.28-8.18,1.29-12.28.1-31.39.06-62.78.07-94.18,0-3.47,0-6.94,0-10.98Z",
  "M1103.81,145.01v-25.2h42.8c-.23,16.53,2.05,32.56-1.48,48.27-4.71,20.97-24.03,34.21-45.82,32.46-19.76-1.59-37.38-18.66-38.15-39.36-.97-26.33-1-52.74,0-79.07.79-20.74,19.48-38.23,39.36-39.17,22.76-1.08,41.49,13.35,45.28,35.38,1.03,5.98.68,12.19.99,18.93h-26.21c-.29-3.11-.39-5.69-.8-8.23-.51-3.19-.8-6.53-2.02-9.46-2.45-5.88-6.95-9.65-13.54-9.91-6.62-.26-11.32,3.29-14.27,8.87-1.33,2.52-2.15,5.62-2.17,8.46-.16,23.4-.27,46.81,0,70.2.12,9.8,7.34,16.98,15.88,16.94,8.74-.04,15.43-6.97,16.07-16.82.21-3.21.03-6.44.03-10.6-5.41-.57-10.24-1.08-15.96-1.68Z",
  "M691.09,45.18h34.07c8.72,50.63,17.43,101.23,26.32,152.85h-26.06c-1.16-5.08-2.38-10.41-3.71-16.19h-28.36c-1.1,5.25-2.16,10.34-3.39,16.22h-26.26c9.22-51.46,18.27-102.01,27.39-152.87ZM717.77,157.48c-2.96-20.63-5.79-40.37-8.62-60.11-.73.01-1.46.02-2.19.04-3.15,19.72-6.3,39.44-9.59,60.07h20.4Z",
  "M453.84,198.22h-71.52V45.39h71.61v25.84h-44.78c-1.21,12.05-.73,23.05-.35,35.48h45.21v26.46h-44.8v38.79h44.63v26.25Z",
  "M1310.44,198.44h-25.71c-.32-2.59-.82-4.83-.83-7.06-.07-14.22-.27-28.46.07-42.67.22-9.04-1.27-17.59-4.11-26.13-7.39-22.21-14.46-44.53-21.64-66.81-.98-3.05-1.84-6.14-3.07-10.26h25.96c4.82,17.61,9.69,35.36,14.55,53.11.86-.04,1.73-.07,2.59-.11,7.06-17,9.48-35.54,16-53.24h25.55c-.97,3.59-1.59,6.38-2.47,9.07-7.86,23.93-15.94,47.79-23.53,71.81-1.84,5.82-2.84,12.11-2.98,18.22-.35,14.81.06,29.63.1,44.45,0,2.88-.28,5.77-.48,9.63Z",
  "M568.75,145.56h26.57c.25,4.3.43,8.05.7,11.79.71,9.61,6.85,16.34,15.18,16.72,8.03.36,15.23-6.24,16.59-15.49.43-2.91.31-5.91.32-8.87.02-31.4.02-62.79.03-94.19,0-3.19,0-6.38,0-10.21h25.87c.31,2.71.79,5,.8,7.28.15,34.06.28,68.12.31,102.18.01,15.5-5.91,28.39-18.4,37.65-24.78,18.37-59.87,5.07-66.26-25.16-1.43-6.75-1.14-13.87-1.7-21.7Z",
  "M908.9,198.89h-24.91V44.67h23.66c2.79,7.33,3.85,138.24,1.25,154.22Z",
];

export default function BenjaminGuyLiveHome() {
  const [themeKey, setThemeKey] = useState("ocean");
  const theme = THEMES[themeKey as keyof typeof THEMES];

  const events = [
    { date: "Sat, Sep 13, 2025", time: "7:00–10:00 PM", venue: "The Brass Tap — Palm Coast", address: "250 Palm Coast Pkwy NE Suite 201, Palm Coast, FL", link: "#book" },
    { date: "Sat, Oct 11, 2025", time: "7:00–10:00 PM", venue: "The Brass Tap — Palm Coast", address: "Palm Coast, FL", link: "#book" },
    { date: "Sat, Nov 8, 2025", time: "7:00–10:00 PM", venue: "The Brass Tap — Palm Coast", address: "Palm Coast, FL", link: "#book" },
  ];

  const features = [
    { icon: "🎤", title: "Acoustic Covers • 50s–Today", text: "Crowd-pleasers across Top 40, pop, rock, and country — arranged for a warm, intimate vibe." },
    { icon: "🎵", title: "Live Requests", text: "Scan a QR and drop your request — the setlist evolves with the room." },
    { icon: "✨", title: "Clean, Pro Look & Sound", text: "Compact PA, tasteful lighting, and volume that fits bars, patios, private events, and taprooms." },
  ];

  const testimonials = [
    { quote: "Perfect vibe for our taproom — guests stick around, sing along, and the volume is always dialed in.", name: "Manager", org: "The Brass Tap, Palm Coast" },
    { quote: "Ben makes our patio feel like a private concert. Great with requests and reading the room.", name: "Owner", org: "Local Restaurant" },
  ];

  const photoGrid = [
    { label: "Live at Brass Tap" },
    { label: "Acoustic setup" },
    { label: "Crowd requests" },
    { label: "Outdoor patio" },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bg} text-slate-100`}>
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          {/* Left: Logo + Request */}
          <div className="flex items-center gap-3">
            <ThemedLogo themeKey={themeKey} className="h-12" />
            <ButtonBase href="#requests" size="sm" className="ml-1">Request a Song</ButtonBase>
          </div>
          {/* Middle: Nav */}
          <nav className="flex items-center gap-4 text-sm">
            <a href="#shows" className="hover:text-white/90">Shows</a>
            <a href="#about" className="hover:text-white/90">About</a>
            <a href="#media" className="hover:text-white/90">Media</a>
            <a href="#book" className="hover:text-white/90">Book</a>
          </nav>
          {/* Right: Theme + Book */}
          <div className="flex items-center gap-2">
            <ThemePicker themeKey={themeKey} setThemeKey={setThemeKey} />
            <ButtonBase href="#book" size="sm">Book Me</ButtonBase>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 ${theme.glow}`} />
        <div className="mx-auto max-w-6xl px-4 py-18 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Palm Coast's Premier Acoustic
              <span className={`block bg-gradient-to-r ${theme.accentFrom} ${theme.accentTo} bg-clip-text text-transparent`}>Covers & Requests</span>
            </h1>
            <p className="mt-5 text-slate-300 max-w-xl">Solo singer‑guitarist delivering feel‑good hits from the 60s through today. Built for taprooms, patios, private events — and sing‑along nights where your crowd helps pick the set.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonBase href="#book" size="lg">Book for an Event</ButtonBase>
              <ButtonBase href="#shows" variant="secondary" size="lg">Upcoming Shows</ButtonBase>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-400">
              <span>⏱️ Typical showtime: 7–10pm</span>
              <span>📍 Palm Coast • St. Augustine • Jacksonville</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-3xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden grid place-items-center text-center p-8">
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.accentFrom}/20 via-transparent ${theme.accentTo}/20`} />
              <div className="relative">
                <div className="text-5xl mb-3">▶️</div>
                <p className="text-lg font-medium">Live acoustic vibes</p>
                <p className="text-sm text-slate-300">Drop a promo clip or hero photo here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE / FEATURES */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-10 w-10 rounded-2xl bg-white/10 grid place-items-center mb-3 text-lg">{f.icon}</div>
                <CardTitle className={`font-semibold bg-gradient-to-r ${theme.accentFrom} ${theme.accentTo} bg-clip-text text-transparent`}>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="mx-auto max-w-6xl px-4 pb-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          {[{k:"Songs", v:"150+"},{k:"Set Length", v:"3 hrs"},{k:"Genres", v:"Pop • Rock • Country"},{k:"Requests", v:"QR Live"}].map(({k,v})=> (
            <div key={k} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className={`text-xl font-semibold bg-gradient-to-r ${theme.accentFrom} ${theme.accentTo} bg-clip-text text-transparent`}>{v}</div>
              <div className="text-slate-400 mt-1">{k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWS */}
      <section id="shows" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Upcoming Shows</h2>
          <ButtonBase href="#book" variant="secondary" className="rounded-2xl">Book a Date</ButtonBase>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((e, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">📅 {e.date}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 space-y-2">
                <div className="flex items-center gap-2">🕒 {e.time}</div>
                <div className="flex items-center gap-2">📍 {e.venue}</div>
                <p className="text-slate-400">{e.address}</p>
                <div className="pt-2">
                  <ButtonBase href={e.link} size="sm">Details</ButtonBase>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* MEDIA */}
      <section id="media" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Sample Setlist</CardTitle></CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-300">
                {["Tom Petty — Free Fallin'","Zac Brown — Chicken Fried","Eagles — Take It Easy","Oasis — Wonderwall","Ed Sheeran — Perfect","Chris Stapleton — Tennessee Whiskey","Goo Goo Dolls — Iris","Johnny Cash — Folsom Prison Blues","Van Morrison — Brown Eyed Girl","Lumineers — Ho Hey"].map((song) => (
                  <li key={song} className="list-disc list-inside">{song}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card id="requests">
            <CardHeader><CardTitle>Request a Song (QR‑Ready)</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-300 space-y-3">
              <p>Use this form at shows, or link it behind a QR so guests can submit requests and shout‑outs in real time.</p>
              <form className="grid gap-3">
                <Input placeholder="Your name" aria-label="Your name" />
                <Input placeholder="Song & artist" aria-label="Song and artist" />
                <Textarea placeholder="Who should I dedicate it to?" aria-label="Dedication" rows={4} />
                <ButtonBase>Send Request</ButtonBase>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PHOTO STRIP */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {photoGrid.map((p, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 overflow-hidden grid place-items-center text-sm text-slate-400">
              <div className="flex items-center gap-2">🖼️ {p.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">What Venues Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-amber-300 mb-3">{"★★★★★"}</div>
                <p className="text-slate-200 leading-relaxed">“{t.quote}”</p>
                <p className="text-slate-400 text-sm mt-3">— {t.name}, {t.org}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* BOOKING */}
      <section id="book" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">Booking & Inquiries</h2>
            <p className="text-slate-300 mb-5">Taprooms, restaurants, private parties, corporate mixers, and holiday events. Share a few details and I'll get right back to you.</p>
            <form className="grid gap-3">
              <Input placeholder="Your name" aria-label="Your name" />
              <Input placeholder="Email" type="email" aria-label="Email" />
              <Input placeholder="Phone" type="tel" aria-label="Phone" />
              <Input placeholder="Event date (if known)" aria-label="Event date" />
              <Textarea placeholder="Tell me about the event (venue, times, vibe, requests)" aria-label="Event details" rows={6} />
              <div className="flex gap-3">
                <ButtonBase>Request Availability</ButtonBase>
                <ButtonBase href="#shows" variant="secondary">See Public Dates</ButtonBase>
              </div>
            </form>
            <p className="text-xs text-slate-400 mt-3">By submitting, you agree to be contacted about booking.</p>
          </div>
          <Card>
            <CardHeader><CardTitle>Tech & Setup</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-300 space-y-2">
              <ul className="grid gap-2 list-disc list-inside">
                <li>Pro acoustic guitar + vocal mic with compact PA</li>
                <li>Clean stage look, minimal footprint, fast load‑in/out</li>
                <li>Volume‑conscious: suited for rooms that value conversation</li>
                <li>Can provide background playlists for breaks</li>
                <li>Outdoor‑ready with canopy when needed</li>
              </ul>
              <div className="pt-3 grid gap-2 text-slate-400">
                <span>📞 <a href="tel:+18628122656" className="hover:underline">862.812.2656</a></span>
                <span>✉️ <a href="mailto:ben@benjaminguy.live" className="hover:underline">ben@benjaminguy.live</a></span>
                <div className="flex items-center gap-3 pt-2">
                  <a href="https://www.facebook.com/BenjaminGuyLive/" className="hover:underline">Facebook</a>
                  <a href="#" className="hover:underline">Instagram</a>
                  <a href="#" className="hover:underline">YouTube</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Benjamin Guy Live. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#book" className="hover:underline">Contact</a>
            <a href="#shows" className="hover:underline">Public Dates</a>
            <a href="#media" className="hover:underline">Media</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --------------- UI Helpers ---------------
function ThemePicker({ themeKey, setThemeKey }: { themeKey: string; setThemeKey: (k: string) => void }) {
  return (
    <div className="flex items-center gap-2" aria-label="Theme picker">
      <span className="hidden md:inline text-xs text-slate-400 mr-1">Theme:</span>
      {Object.entries(THEMES).map(([key, t]) => (
        <button
          key={key}
          onClick={() => setThemeKey(key)}
          className={`h-7 px-3 rounded-xl text-xs border transition whitespace-nowrap ${
            themeKey === key ? "border-white/60 bg-white/10" : "border-white/10 bg-white/5 hover:border-white/20"
          }`}
          aria-pressed={themeKey === key}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}

// Themed wordmark that follows the active theme gradient (single gradient across whole logo)
function ThemedLogo({ themeKey, className = "h-12" }: { themeKey: string; className?: string }) {
  const stops = THEME_STOPS[themeKey] ?? THEME_STOPS.ocean;
  const gradId = `logoGradient-${themeKey}`;
  return (
    <svg viewBox="0 0 1339.81 243.91" className={`w-auto ${className}`} role="img" aria-label="Benjamin Guy Live">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1339.81" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={stops.from} />
          <stop offset="100%" stopColor={stops.to} />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradId})`}>
        {LOGO_SVG_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
