"use client";

import { useEffect, useState } from "react";
import { EventCard } from "@/components/events/event-card";
import { Calendar, Search, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventData {
  id: string;
  title: string;
  eventType: string;
  venue: string | null;
  startDatetime: string;
  endDatetime: string;
  status: string | null;
  participationPoints: number | null;
  posterUrl?: string | null;
  description?: string | null;
}

export default function FacultyEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events?status=all&limit=100");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((ev) => {
    const now = new Date();
    const startDate = ev.startDatetime ? new Date(ev.startDatetime) : null;
    const endDate = ev.endDatetime ? new Date(ev.endDatetime) : null;
    const dateHasPassed =
      startDate && !isNaN(startDate.getTime())
        ? endDate && !isNaN(endDate.getTime())
          ? endDate < now
          : startDate < now
        : false;
    const isCompleted =
      ev.status === "completed" ||
      ev.status === "cancelled" ||
      ev.status === "closed" ||
      dateHasPassed;

    let matchesFilter = activeFilter === "all" && !isCompleted;
    if (activeFilter === "completed") {
      matchesFilter = isCompleted;
    } else if (activeFilter === "published") {
      matchesFilter = !isCompleted && ev.status === "published";
    } else if (activeFilter === "draft") {
      matchesFilter = ev.status === "draft";
    } else if (activeFilter !== "all") {
      matchesFilter = (ev.eventType || "").toLowerCase().includes(activeFilter.toLowerCase());
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      (ev.eventType || "").toLowerCase().includes(q) ||
      (ev.venue || "").toLowerCase().includes(q) ||
      (ev.description || "").toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full space-y-6 font-['Hanken_Grotesk'] text-[#1A0D0C] pb-16">
      {/* Hero Header Banner */}
      <div className="relative w-full max-w-[1014px] min-h-[203px] bg-white rounded-[38px] border border-gray-100/80 p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden font-['Hanken_Grotesk']">
        <div className="absolute top-0 right-0 w-[240.16px] h-[37.24px] rounded-bl-[65px] bg-gradient-to-b from-[#FF0000] to-[#990000] flex items-center justify-center text-white font-['Hanken_Grotesk'] text-[15.2px] font-semibold tracking-[-0.456px] z-10 shadow-sm">
          CAMPUS ACTIVITIES
        </div>

        <div className="space-y-1 pt-2 md:pt-0 max-w-xl font-['Hanken_Grotesk']">
          <h1 className="text-[36px] sm:text-[46px] font-semibold text-[#1A0D0C] tracking-[-1.38px] leading-tight font-['Hanken_Grotesk']">
            Events Overview
          </h1>
          <p className="text-[16px] sm:text-[20px] font-semibold text-[#B0B0B0] tracking-[-0.6px] leading-snug font-['Hanken_Grotesk']">
            Review and track all published, draft, and completed IEDC events
          </p>
        </div>

        {/* Total Events Pill & Refresh Action */}
        <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 font-['Hanken_Grotesk']">
          <div className="flex flex-col justify-end items-start w-[145px] h-[101px] p-[14px_20px_10px_20px] rounded-[20px] bg-[#1E1614] gap-[5px] shadow-sm font-['Hanken_Grotesk']">
            <span className="text-[#FFFFFF] text-[15px] font-normal tracking-[-0.5px] leading-none truncate max-w-full">
              Total Events
            </span>
            <span className="text-[#FFFFFF] text-[38px] font-bold tracking-[-1.14px] leading-none">
              {events.length}
            </span>
          </div>

          <button
            onClick={fetchEvents}
            disabled={loading ? true : undefined}
            suppressHydrationWarning
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-xs cursor-pointer disabled:opacity-50 font-['Hanken_Grotesk']"
            title="Refresh Events"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Live Search */}
      <div className="max-w-[1014px] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-['Hanken_Grotesk']">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none font-['Hanken_Grotesk']">
          {[
            { id: "all", label: "All Events" },
            { id: "published", label: "Published" },
            { id: "draft", label: "Draft" },
            { id: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer font-['Hanken_Grotesk']",
                activeFilter === tab.id
                  ? "bg-[#1A0D0C] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-[320px] shrink-0 font-['Hanken_Grotesk']">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events by title, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[44px] pl-11 pr-4 rounded-[22px] bg-white border border-gray-200/80 text-xs font-medium placeholder:text-gray-400 focus:outline-none focus:border-[#1A0D0C] transition-colors shadow-xs font-['Hanken_Grotesk']"
          />
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-[1014px] font-['Hanken_Grotesk']">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full max-w-[247px] h-[340px] bg-white rounded-[32px] border border-gray-100/80 p-5 animate-pulse mx-auto shadow-xs"
            />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-[1014px] font-['Hanken_Grotesk']">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              {...event}
              linkPrefix="/faculty/events"
            />
          ))}
        </div>
      ) : (
        <div className="max-w-[1014px] bg-white rounded-[38px] border border-gray-100/90 p-12 md:p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-3 font-['Hanken_Grotesk']">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#1A0D0C] font-['Hanken_Grotesk']">
            No events found
          </h3>
          <p className="text-sm text-gray-400 max-w-md font-['Hanken_Grotesk']">
            No campus events match your selected filter or search query.
          </p>
        </div>
      )}

      <div className="max-w-[1014px] pt-12 flex justify-end font-['Hanken_Grotesk']">
        <p className="w-[242px] h-[26px] text-[#AAA] text-right font-['Hanken_Grotesk'] text-[16px] font-normal leading-[94.331%] tracking-[-0.48px]">
          IEDC 2026 SJCET - TECH TEAM
        </p>
      </div>
    </div>
  );
}