"use client";

import { useEffect, useState } from "react";
import { EventCard, EventCardProps } from "@/components/events/event-card";
import { CreateEventModal } from "@/components/events/create-event-modal";
import { Plus, Calendar, Sparkles, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTER_ITEMS = [
  { key: "all", label: "All Events" },
  { key: "active", label: "Active / Upcoming" },
  { key: "workshop", label: "Workshops" },
  { key: "hackathon", label: "Hackathons" },
  { key: "techy_pedia", label: "Techy Pedia" },
  { key: "wednesday_cafe", label: "Wednesday Cafe" },
  { key: "completed", label: "Completed" },
];

export default function ExecomEventsPage() {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events?status=all&limit=50");
      if (res.ok) {
        const data = await res.json();
        if (data.events) {
          const now = new Date();
          const formatted: EventCardProps[] = data.events.map(
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

              const isClosed =
                e.status === "completed" ||
                e.status === "cancelled" ||
                e.status === "closed" ||
                dateHasPassed;

              return {
                id: e.id as string,
                title: e.title as string,
                eventType: (e.eventType as string) || "workshop",
                venue: (e.venue as string) || "IDEALab",
                startDatetime: startStr || "Upcoming",
                endDatetime: endStr,
                description: e.description as string,
                posterUrl: e.posterUrl as string,
                status: e.status as string,
                isClosed,
                linkPrefix: "/execom/events",
              };
            }
          );
          setEvents(formatted);
        }
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (activeTab === "all") return !event.isClosed;
    if (activeTab === "active") return !event.isClosed && event.status !== "draft";
    if (activeTab === "completed") return event.isClosed;
    return (
      !event.isClosed &&
      event.eventType.toLowerCase().includes(activeTab.toLowerCase())
    );
  });

  const activeCount = events.filter((e) => !e.isClosed && e.status !== "draft").length;
  const completedCount = events.filter((e) => e.isClosed).length;

  return (
    <div className="w-full space-y-6 font-['Hanken_Grotesk'] text-[#1A0D0C] pb-16">
      {/* Hero Header Card */}
      <div className="w-full max-w-[1014px] min-h-[203px] rounded-[38px] bg-white p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden shadow-sm border border-gray-100/80 my-8 gap-6 group">
        <div className="z-10 max-w-xl space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-[#D9383A]/10 text-[#D9383A] text-[11px] font-bold uppercase tracking-wider">
              Execom Workspace
            </span>
          </div>
          <h1 className="text-[36px] md:text-[46px] font-semibold text-[#1A0D0C] tracking-[-1.38px] leading-tight">
            Event Management
          </h1>
          <p className="text-[16px] md:text-[20px] font-semibold text-[#B0B0B0] tracking-[-0.6px] leading-snug">
            Create, manage, and coordinate IEDC events across all teams.
          </p>
        </div>

        {/* Action Button & Quick Stats */}
        <div className="z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center h-[56px] px-6 sm:px-8 gap-2.5 rounded-[31px] bg-[#100A0A] text-white text-[15px] sm:text-[18px] font-normal tracking-[-0.6px] shadow-sm hover:bg-[#2A2020] active:scale-98 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Background glow decoration */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#D9383A]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="max-w-[1014px] flex flex-wrap items-center justify-between gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-[28px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-[#1A0D0C]">
              {loading ? "..." : activeCount} Active Events
            </span>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              {loading ? "..." : completedCount} Completed
            </span>
          </div>
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2 hidden sm:flex">
            <Calendar className="w-4 h-4 text-[#D9383A]" />
            <span className="text-sm font-medium text-gray-500">
              {loading ? "..." : events.length} Total Events
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="text-xs font-semibold text-[#D9383A] hover:underline flex items-center gap-1 px-2 cursor-pointer ml-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          + Launch New Event
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide max-w-[1014px]">
        {FILTER_ITEMS.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={cn(
                "inline-flex items-center justify-center px-4 py-1.5 rounded-[26.92px] border text-[13px] font-normal tracking-[-0.39px] whitespace-nowrap transition-all duration-200 cursor-pointer h-[36px]",
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

      {/* Event Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-[1014px] pt-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full max-w-[247px] h-[280px] sm:h-[380px] bg-white rounded-3xl animate-pulse border border-gray-100 mx-auto"
            />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-[1014px] pt-4">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <div className="max-w-[1014px] bg-white rounded-[32px] border border-gray-100 p-16 text-center shadow-sm my-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#D9383A] flex items-center justify-center mb-4">
            <Filter className="w-8 h-8" />
          </div>
          <p className="text-gray-800 font-bold text-xl">No events found</p>
          <p className="text-gray-500 text-sm mt-1 max-w-md">
            No events match the selected category filter. Click below to create your first event!
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#100A0A] text-white text-sm font-medium hover:bg-[#2A2020] transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>
      )}

      {/* Footer Tagline */}
      <div className="max-w-[1014px] pt-12 flex justify-end">
        <p className="w-[242px] h-[26px] text-[#AAA] text-right font-['Hanken_Grotesk'] text-[16px] font-normal leading-[94.331%] tracking-[-0.48px]">
          IEDC 2026 SJCET - TECH TEAM
        </p>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchEvents}
      />
    </div>
  );
}