"use client";

import { useId, useRef } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import { toDayKey } from "../_lib/dates";
import type { HistoryAction } from "../_lib/history";
import { parseBackup, serializeBackup } from "../_lib/storage";
import type { SyncStatus } from "../_lib/sync";
import type { PlanState } from "../_lib/types";

type PlanMenuProps = {
  state: PlanState;
  act: (action: HistoryAction) => void;
  notify: (message: string) => void;
  syncStatus: SyncStatus;
};

const SYNC_LABEL: Record<SyncStatus, string> = {
  unknown: "Sync: checking…",
  off: "Sync: off (this device only)",
  synced: "Sync: up to date",
  pending: "Sync: saving…",
  error: "Sync: failed — data is safe locally",
};

/** Board overflow menu: backup export/import and sync status. */
export default function PlanMenu({ state, act, notify, syncStatus }: PlanMenuProps) {
  const menuId = useId();
  const anchorName = "--plan-board-menu-pop";
  const popRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const closeMenu = () => popRef.current?.hidePopover();

  const exportBackup = () => {
    const blob = new Blob([serializeBackup(state)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `plan-backup-${toDayKey(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
    closeMenu();
    notify("Backup downloaded");
  };

  const importBackup = async (file: File) => {
    const imported = parseBackup(await file.text());
    if (!imported) {
      notify("That file isn’t a plan backup");
      return;
    }
    act({ type: "IMPORT_STATE", state: imported });
  };

  return (
    <>
      <button
        type="button"
        aria-label="Board menu"
        title="Board menu"
        className="plan-menu-btn"
        {...({ popovertarget: menuId } as HTMLAttributes<HTMLButtonElement>)}
        style={{ anchorName } as CSSProperties}
      >
        <DotsIcon />
      </button>

      <div
        ref={popRef}
        id={menuId}
        popover="auto"
        className="plan-pop plan-pop--end"
        style={{ positionAnchor: anchorName } as CSSProperties}
      >
        <button type="button" className="plan-pop__item" onClick={exportBackup}>
          Download backup
        </button>
        <button
          type="button"
          className="plan-pop__item"
          onClick={() => {
            fileRef.current?.click();
          }}
        >
          Import backup…
        </button>
        <p className="plan-pop__note">{SYNC_LABEL[syncStatus]}</p>
        <p className="plan-pop__note">Quick add: !p1 sets priority, @tue schedules</p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          closeMenu();
          if (file) void importBackup(file);
        }}
      />
    </>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="3.25" cy="8" r="1.3" />
      <circle cx="8" cy="8" r="1.3" />
      <circle cx="12.75" cy="8" r="1.3" />
    </svg>
  );
}
