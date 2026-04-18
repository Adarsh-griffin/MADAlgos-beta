"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Loader2, Mail, MoreHorizontal, RefreshCw } from "lucide-react";

function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultDatetimeResend(linkValidityHours: number, currentExpiresIso: string | undefined) {
  const now = Date.now();
  const cur = currentExpiresIso ? new Date(currentExpiresIso).getTime() : 0;
  if (cur > now) return new Date(cur);
  return new Date(now + linkValidityHours * 3600 * 1000);
}

function defaultDatetimeNewAttempt(linkValidityHours: number) {
  return new Date(Date.now() + linkValidityHours * 3600 * 1000);
}

type Props = {
  testId: string;
  tokenId: string;
  /** Session token in the public test URL (`/test/[token]`). */
  inviteToken: string;
  /** Same origin as invitation emails (`APP_BASE_URL` / `NEXT_PUBLIC_APP_URL`). */
  inviteBaseUrl: string;
  studentEmail: string;
  linkValidityHours: number;
  currentExpiresIso: string;
};

export function AssessmentInviteActions({
  testId,
  tokenId,
  inviteToken,
  inviteBaseUrl,
  studentEmail,
  linkValidityHours,
  currentExpiresIso,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmNewOpen, setConfirmNewOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"resend" | "new_attempt" | null>(null);
  const [expiresLocal, setExpiresLocal] = useState("");
  const [loading, setLoading] = useState(false);

  const inviteUrl = `${inviteBaseUrl.replace(/\/$/, "")}/test/${inviteToken}`;

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Invite link copied");
    } catch {
      toast.error("Could not copy — try again or copy manually.");
    }
  };

  const openFor = useCallback(
    (action: "resend" | "new_attempt") => {
      if (action === "new_attempt") {
        setConfirmNewOpen(true);
        return;
      }
      const d = defaultDatetimeResend(linkValidityHours, currentExpiresIso);
      setExpiresLocal(toDatetimeLocalValue(d));
      setPendingAction("resend");
      setDialogOpen(true);
    },
    [linkValidityHours, currentExpiresIso]
  );

  const afterConfirmNewAttempt = () => {
    setConfirmNewOpen(false);
    const d = defaultDatetimeNewAttempt(linkValidityHours);
    setExpiresLocal(toDatetimeLocalValue(d));
    setPendingAction("new_attempt");
    setDialogOpen(true);
  };

  const submit = async () => {
    if (!pendingAction || !expiresLocal) return;
    const expiresAt = new Date(expiresLocal);
    if (Number.isNaN(expiresAt.getTime())) {
      toast.error("Invalid date/time.");
      return;
    }
    if (expiresAt.getTime() <= Date.now()) {
      toast.error("Expiry must be in the future.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/assessment/invite-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId,
          tokenId,
          action: pendingAction,
          expiresAt: expiresAt.toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Request failed.");
        return;
      }
      if (data.emailError) {
        toast.error(`Email issue: ${String(data.emailError).slice(0, 200)}`);
      } else if (data.emailSkipped) {
        toast.warning(data.message || "SendGrid not configured.");
      } else {
        toast.success(data.message || "Done.");
      }
      setDialogOpen(false);
      setPendingAction(null);
      window.location.reload();
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full h-8 w-8 p-0 border-white/15"
            aria-label="Invite actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => void copyInviteLink()}>
            <Copy className="mr-2 h-4 w-4" />
            Copy invite link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openFor("resend")}>
            <Mail className="mr-2 h-4 w-4" />
            Resend email (same link)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openFor("new_attempt")}
            className="text-amber-600 focus:text-amber-700 dark:text-amber-200 dark:focus:text-amber-100"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            New attempt / new link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmNewOpen} onOpenChange={setConfirmNewOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New attempt and new link?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the graded result (if any), clears progress, and issues a new invite link for{" "}
              <span className="font-medium text-foreground">{studentEmail}</span>. The previous link stops working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => afterConfirmNewAttempt()}
              className="bg-amber-600 hover:bg-amber-600/90 text-white"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          if (!o) setPendingAction(null);
          setDialogOpen(o);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {pendingAction === "new_attempt" ? "New attempt — link expiry" : "Resend invitation"}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === "new_attempt"
                ? "Choose when the new invite link should expire (your local date and time)."
                : "Send the invitation email again with the same link. Set when the link expires."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor={`exp-${tokenId}`}>Link expires</Label>
            <Input
              id={`exp-${tokenId}`}
              type="datetime-local"
              value={expiresLocal}
              onChange={(e) => setExpiresLocal(e.target.value)}
              disabled={loading}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="button" onClick={submit} disabled={loading} className="bg-primary text-black">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {pendingAction === "new_attempt" ? "Create link & send" : "Send email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
