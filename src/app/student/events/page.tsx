"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EventCard, EventCardProps } from "@/components/events/event-card";
import { cn } from "@/lib/utils";

const FILTER_ITEMS = [
  { key: "all", label: "All events" },
  { key: "techy_pedia", label: "Techy Pedia" },
  { key: "wednesday_cafe", label: "Wednesday Cafe" },
  { key: "hackathon", label: "Hackathons" },
  { key: "gbm", label: "GBM" },
  { key: "tech_events", label: "Tech Events" },
  { key: "completed", label: "Completed" },
];

const TECHY_PEDIA_POSTER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="247" height="303" viewBox="0 0 247 303">
  <rect width="247" height="303" fill="#D9383A"/>
  <rect x="10" y="10" width="227" height="40" rx="6" fill="#FACC15"/>
  <text x="227" y="30" text-anchor="end" font-family="Hanken Grotesk, sans-serif" font-weight="900" font-size="20" fill="#D9383A">TECHY</text>
  <text x="227" y="46" text-anchor="end" font-family="Hanken Grotesk, sans-serif" font-weight="900" font-size="20" fill="#D9383A">PEDIA</text>
  <rect x="14" y="14" width="105" height="32" rx="4" fill="#E11D48"/>
  <text x="20" y="27" font-family="Hanken Grotesk, sans-serif" font-weight="800" font-size="10" fill="#FDE047">08TH JULY 26</text>
  <text x="20" y="38" font-family="Hanken Grotesk, sans-serif" font-weight="700" font-size="8" fill="#FFFFFF">3:30 TO 4:30 | OFFLINE</text>
  <g transform="translate(24, 60)">
    <rect x="0" y="0" width="199" height="130" rx="8" fill="#FFF" fill-opacity="0.1"/>
    <ellipse cx="100" cy="70" rx="55" ry="50" fill="#FDA4AF"/>
    <ellipse cx="100" cy="55" rx="30" ry="32" fill="#881337"/>
    <ellipse cx="100" cy="52" rx="24" ry="24" fill="#FECDD3"/>
    <path d="M60 115 C60 85 140 85 140 115 Z" fill="#9F1239"/>
  </g>
  <rect x="14" y="195" width="219" height="60" rx="8" fill="#9F1239" opacity="0.95"/>
  <text x="123" y="209" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="700" font-size="9" fill="#FECDD3">Our Speaker</text>
  <text x="123" y="223" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="800" font-size="14" fill="#FFFFFF">Lena Annette Wilson</text>
  <rect x="24" y="231" width="199" height="18" rx="9" fill="#FACC15"/>
  <text x="123" y="244" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="800" font-size="9" fill="#1E1B4B">How I Built This (And How You Can Too)</text>
  <text x="123" y="270" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="700" font-size="10" fill="#FFFFFF">Venue : IDEALab</text>
  <line x1="14" y1="277" x2="233" y2="277" stroke="#FDA4AF" stroke-width="0.8"/>
  <text x="20" y="291" font-family="Hanken Grotesk, sans-serif" font-weight="800" font-size="8" fill="#FFFFFF">ST. JOSEPH'S COLLEGE OF ENG & TECH</text>
</svg>
`)}`;

const WEDNESDAY_CAFE_POSTER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="247" height="303" viewBox="0 0 247 303">
  <rect width="247" height="303" fill="#0284C7"/>
  <text x="123" y="30" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" letter-spacing="-0.5">WEDNESDAY CAFE</text>
  <text x="123" y="44" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="700" font-size="9" fill="#BAE6FD" letter-spacing="1">CLEARED FOR TAKEOFF</text>
  <rect x="180" y="12" width="53" height="34" rx="4" fill="#0369A1"/>
  <text x="206" y="25" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="800" font-size="8" fill="#7DD3FC">JULY 15</text>
  <text x="206" y="38" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="800" font-size="10" fill="#FFFFFF">2026</text>
  <g transform="translate(24, 55)">
    <ellipse cx="100" cy="65" rx="55" ry="50" fill="#E0F2FE"/>
    <ellipse cx="100" cy="50" rx="30" ry="32" fill="#0369A1"/>
    <ellipse cx="100" cy="48" rx="24" ry="24" fill="#BAE6FD"/>
    <path d="M60 110 C60 80 140 80 140 110 Z" fill="#075985"/>
  </g>
  <path d="M210 145 L230 130 L225 150 L240 155 L210 160 Z" fill="#7DD3FC" opacity="0.7"/>
  <text x="220" y="175" text-anchor="end" font-family="Hanken Grotesk, sans-serif" font-weight="800" font-size="13" fill="#FFFFFF">Aibel Bin Zacariah</text>
  <text x="220" y="187" text-anchor="end" font-family="Hanken Grotesk, sans-serif" font-weight="600" font-size="9" fill="#BAE6FD">AI Research Scientist</text>
  <rect x="20" y="198" width="207" height="30" rx="6" fill="#FFFFFF"/>
  <text x="123" y="218" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="900" font-size="11" fill="#0F172A">*How to Fly a Boeing 737*</text>
  <text x="20" y="248" font-family="Hanken Grotesk, sans-serif" font-weight="700" font-size="9" fill="#E0F2FE">15TH JULY 26 | 3:30PM OFFLINE</text>
  <text x="227" y="248" text-anchor="end" font-family="Hanken Grotesk, sans-serif" font-weight="700" font-size="9" fill="#E0F2FE">VENUE : IDEALab</text>
  <line x1="14" y1="258" x2="233" y2="258" stroke="#38BDF8" stroke-width="0.8"/>
  <text x="20" y="285" font-family="Hanken Grotesk, sans-serif" font-weight="800" font-size="8" fill="#FFFFFF">ST. JOSEPH'S COLLEGE OF ENG & TECH</text>
</svg>
`)}`;

const EXECOM_POSTER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="247" height="303" viewBox="0 0 247 303">
  <rect width="247" height="303" fill="#1A0D0C"/>
  <circle cx="123" cy="110" r="70" fill="#E11D48" opacity="0.3"/>
  <polygon points="123,50 135,80 167,80 140,100 150,130 123,110 96,130 106,100 79,80 111,80" fill="#FACC15"/>
  <text x="123" y="165" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="800" font-size="12" fill="#94A3B8" letter-spacing="2">INTRODUCING</text>
  <text x="123" y="195" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF">IEDC EXECOM</text>
  <text x="123" y="225" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="900" font-size="26" fill="#FACC15">‘26</text>
  <text x="123" y="270" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="700" font-size="9" fill="#94A3B8">ST. JOSEPH'S COLLEGE OF ENG & TECH</text>
</svg>
`)}`;

const SPEAKER_POSTER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="247" height="303" viewBox="0 0 247 303">
  <rect width="247" height="303" fill="#4C1D95"/>
  <circle cx="123" cy="110" r="50" fill="#A78BFA"/>
  <path d="M83 170 C83 130 163 130 163 170 Z" fill="#6D28D9"/>
  <text x="123" y="200" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF">KEYNOTE SPEAKER</text>
  <text x="123" y="220" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="700" font-size="12" fill="#DDD6FE">Tech Summit 2026</text>
  <text x="123" y="265" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-weight="700" font-size="9" fill="#C4B5FD">VENUE : MAIN AUDITORIUM</text>
</svg>
`)}`;

function StudentEventsContent() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events?status=all&limit=50");
        if (res.ok) {
          const data = await res.json();
          if (data.events) {
            const now = new Date();
            const apiEvents: EventCardProps[] = data.events.map(
              (e: Record<string, unknown>) => {
                const startStr = (e.startDatetime as string) || "";
                const endStr = (e.endDatetime as string) || "";
                const startDate = startStr ? new Date(startStr) : null;
                const endDate = endStr ? new Date(endStr) : null;
                const dateHasPassed =
                  startDate && !isNaN(startDate.getTime())
                    ? endDate && !isNaN(endDate.getTime())
                      ? endDate < now
                      : startDate < now
                    : false;

                return {
                  id: e.id as string,
                  title: e.title as string,
                  eventType: (e.eventType as string) || "workshop",
                  venue: (e.venue as string) || "IDEALab",
                  startDatetime: startStr,
                  endDatetime: endStr,
                  description: (e.description as string) || "",
                  posterUrl: (e.posterUrl as string) || null,
                  status: (e.status as string) || "published",
                  isClosed:
                    e.status === "completed" ||
                    e.status === "cancelled" ||
                    e.status === "closed" ||
                    dateHasPassed,
                };
              }
            );
            setEvents(apiEvents);
          }
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter((event) => {
    if (
      event.status === "completed" ||
      event.status === "cancelled" ||
      event.status === "closed" ||
      event.isClosed
    ) {
      return false;
    }
    const eventTimeStr = event.endDatetime || event.startDatetime;
    if (eventTimeStr) {
      const eventDate = new Date(eventTimeStr);
      if (!isNaN(eventDate.getTime()) && eventDate < new Date()) {
        return false;
      }
    }
    return true;
  });

  const filtered = events.filter((event) => {
    const eventTypeLower = event.eventType.toLowerCase();
    const titleLower = event.title.toLowerCase();
    const activeTabLower = activeTab.toLowerCase();

    if (activeTabLower === "completed") {
      return (
        event.isClosed && titleLower.includes(searchQuery.toLowerCase())
      );
    }
    if (event.isClosed) return false;

    let matchesTab = activeTab === "all";
    if (!matchesTab) {
      if (activeTabLower === "techy_pedia") {
        matchesTab =
          eventTypeLower.includes("techy") || titleLower.includes("techy pedia");
      } else if (activeTabLower === "wednesday_cafe") {
        matchesTab =
          eventTypeLower.includes("wednesday") ||
          titleLower.includes("wednesday cafe");
      } else if (activeTabLower === "hackathon") {
        matchesTab =
          eventTypeLower.includes("hackathon") || titleLower.includes("hackathon");
      } else if (activeTabLower === "gbm") {
        matchesTab = eventTypeLower.includes("gbm") || titleLower.includes("gbm");
      } else if (activeTabLower === "tech_events") {
        matchesTab =
          eventTypeLower.includes("tech") ||
          eventTypeLower.includes("workshop") ||
          eventTypeLower.includes("seminar") ||
          eventTypeLower.includes("bootcamp") ||
          titleLower.includes("tech");
      }
    }

    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const realPosters = upcomingEvents
    .map((e) => e.posterUrl)
    .filter(Boolean) as string[];

  const bannerPosters = [
    ...realPosters,
    TECHY_PEDIA_POSTER,
    WEDNESDAY_CAFE_POSTER,
    EXECOM_POSTER,
    SPEAKER_POSTER,
  ].slice(0, 4);

  return (
    <div className="w-full space-y-6 font-['Hanken_Grotesk'] text-[#1A0D0C] pb-16">
      <div className="w-full max-w-[1014px] min-h-[203px] rounded-[38px] bg-white p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden shadow-sm border border-gray-100/80 my-8 gap-6 group">
        <div className="z-10 max-w-lg space-y-2">
          <h2 className="text-[36px] md:text-[46px] font-semibold text-[#1A0D0C] tracking-[-1.38px] leading-tight">
            Upcoming Events
          </h2>
          <p className="text-[16px] md:text-[20px] font-semibold text-[#B0B0B0] tracking-[-0.6px] leading-snug">
            Register and Attend upcoming events from IEDC SJCET
          </p>
        </div>

        <div className="relative flex items-center justify-end pr-4 py-2 md:py-0 w-full md:w-auto h-[160px] shrink-0 overflow-visible">
          <div className="flex items-center -space-x-12 hover:-space-x-6 transition-all duration-300">
            {bannerPosters.map((poster, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-[110px] h-[145px] rounded-[16px] border-2 border-white shadow-xl overflow-hidden shrink-0 transition-transform duration-300 cursor-pointer bg-slate-900",
                  idx === 0 && "-rotate-6 hover:rotate-0 z-40 hover:z-50",
                  idx === 1 && "rotate-6 hover:rotate-0 z-30 hover:z-50",
                  idx === 2 && "-rotate-3 hover:rotate-0 z-20 hover:z-50",
                  idx === 3 && "rotate-8 hover:rotate-0 z-10 hover:z-50"
                )}
              >
                <img
                  src={poster}
                  alt={`Upcoming event ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide max-w-[1014px]">
        {FILTER_ITEMS.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={cn(
                "inline-flex items-center justify-center px-4 py-1.5 rounded-[26.92px] border text-[13.026px] font-normal tracking-[-0.391px] whitespace-nowrap transition-all duration-200 cursor-pointer h-[36px]",
                isActive
                  ? "bg-[#100A0A] border-[#A5A5A5] text-white shadow-sm"
                  : "bg-[#E2E2E2] border-[#A5A5A5] text-[#3C3C3C] hover:bg-gray-200"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-[1014px] pt-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-full max-w-[247px] h-[280px] sm:h-[380px] bg-white rounded-3xl animate-pulse border border-gray-100 mx-auto"
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-[1014px] pt-4">
          {filtered.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <div className="max-w-[1014px] bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm my-6">
          <p className="text-gray-600 font-bold text-lg">No events found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search or selecting another category filter.
          </p>
        </div>
      )}

      <div className="max-w-[1014px] pt-12 flex justify-end">
        <p
          className="w-[242px] h-[26px] text-[#AAA] text-right font-['Hanken_Grotesk'] text-[16px] font-normal leading-[94.331%] tracking-[-0.48px]"
        >
          IEDC 2026 SJCET - TECH TEAM
        </p>
      </div>
    </div>
  );
}

export default function StudentEventsPage() {
  return (
    <Suspense fallback={null}>
      <StudentEventsContent />
    </Suspense>
  );
}