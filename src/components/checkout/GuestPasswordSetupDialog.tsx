"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fieldClass =
  "h-11 w-full rounded-full border border-white/10 bg-[#1c1c1c] px-4 text-sm text-white placeholder:text-slate-500 focus:border-[#2ab5a0] focus:outline-none focus:ring-2 focus:ring-[#2ab5a0]/60 transition";

type Props = {
  open: boolean;
  email: string | null;
  setupPassword: string;
  setupPassword2: string;
  onSetupPasswordChange: (v: string) => void;
  onSetupPassword2Change: (v: string) => void;
  setupErr: string | null;
  setupBusy: boolean;
  onSave: () => void;
};

/**
 * Post-payment guest password step — modal so it stays visible and centered on the page.
 */
export function GuestPasswordSetupDialog({
  open,
  email,
  setupPassword,
  setupPassword2,
  onSetupPasswordChange,
  onSetupPassword2Change,
  setupErr,
  setupBusy,
  onSave,
}: Props) {
  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="border-border bg-card sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <p className="mb-1 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-[2px] w-9 rounded-full bg-primary" />
            Student account
          </p>
          <DialogTitle>Set your password</DialogTitle>
          <DialogDescription asChild>
            <div className="pt-1 text-left text-sm text-muted-foreground">
              {email ? (
                <p>
                  Payment received for{" "}
                  <strong className="text-card-foreground">{email}</strong>. Choose a password to finish setting up your
                  student account.
                </p>
              ) : (
                <p>Choose a password to finish setting up your account.</p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-4">
          <input
            type="password"
            placeholder="New password (min 6)"
            value={setupPassword}
            onChange={(e) => onSetupPasswordChange(e.target.value)}
            className={fieldClass}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={setupPassword2}
            onChange={(e) => onSetupPassword2Change(e.target.value)}
            className={fieldClass}
            autoComplete="new-password"
          />
          {setupErr ? <p className="text-xs text-red-400">{setupErr}</p> : null}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            disabled={setupBusy}
            className="w-full rounded-full font-semibold sm:w-auto"
            onClick={() => onSave()}
          >
            {setupBusy ? "Saving…" : "Save password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
