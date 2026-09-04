"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Settings2 } from "lucide-react";
import { EventDetail } from "../types";

interface StatusActionsProps {
  event: EventDetail;
  updating: boolean;
  message: string;
  onUpdateStatus: (newStatus: string) => Promise<void>;
}

export function StatusActions({ event, updating, message, onUpdateStatus }: StatusActionsProps) {
  const currentStatus = event.status || "draft";
  const [pendingAction, setPendingAction] = useState<{ label: string; value: string } | null>(null);
  const actions: Array<{ label: string; value: string; className: string }> = [];

  if (currentStatus === "draft") {
    actions.push({
      label: "Publish Event",
      value: "published",
      className: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-transparent",
    });
  } else if (currentStatus === "published") {
    actions.push({
      label: "Start Event (Ongoing)",
      value: "ongoing",
      className: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-transparent",
    });
    actions.push({
      label: "Cancel Event",
      value: "cancelled",
      className: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
    });
  } else if (currentStatus === "ongoing") {
    actions.push({
      label: "Mark as Completed",
      value: "completed",
      className: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-transparent",
    });
  } else if (currentStatus === "cancelled") {
    actions.push({
      label: "Restart Event",
      value: "published",
      className: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-transparent",
    });
  }

  return (
    <div className="bg-white rounded-[32px] border border-gray-100/80 p-8 shadow-sm font-['Hanken_Grotesk'] text-[#1A0D0C] space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
          <Settings2 className="w-4 h-4" />
        </div>
        <h3 className="text-lg font-bold text-[#1A0D0C]">Manage Lifecycle Status</h3>
      </div>

      {message && (
        <div className="rounded-2xl px-4 py-3 text-xs font-semibold bg-blue-50/80 text-blue-700 border border-blue-100">
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {actions.length === 0 ? (
          <p className="text-xs text-gray-400 font-medium">No further status updates available for this event state.</p>
        ) : (
          actions.map((action) => (
            <Button
              key={action.value}
              variant="outline"
              size="sm"
              className={`h-[42px] px-6 rounded-full text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer ${action.className}`}
              disabled={updating}
              onClick={() =>
                action.value === "ongoing"
                  ? setPendingAction(action)
                  : onUpdateStatus(action.value)
              }
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {action.label}
            </Button>
          ))
        )}
      </div>

      <Dialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start this event?</DialogTitle>
            <DialogDescription>
              This will mark the event as ongoing. Are you sure you want to start it now?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              disabled={updating}
              onClick={() => setPendingAction(null)}
            >
              No
            </Button>
            <Button
              type="button"
              className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              disabled={updating}
              onClick={async () => {
                if (!pendingAction) return;
                await onUpdateStatus(pendingAction.value);
                setPendingAction(null);
              }}
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Yes, start event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}