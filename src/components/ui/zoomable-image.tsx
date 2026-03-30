"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function ZoomableImage({
  src,
  alt,
  className,
  zoomedClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  zoomedClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative block w-full cursor-zoom-in"
          aria-label={`Zoom image: ${alt}`}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={cn("h-auto w-full", className)}
          />
          <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 transition group-hover:ring-white/25" />
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-w-[calc(100vw-1.5rem)] border-white/10 bg-[#0b0c14] p-2 sm:max-w-[min(1100px,calc(100vw-3rem))] sm:p-4"
        showCloseButton
      >
        <div className="max-h-[calc(100vh-7rem)] overflow-auto rounded-lg bg-black/20 p-2 sm:p-3">
          <img
            src={src}
            alt={alt}
            className={cn(
              "mx-auto h-auto max-h-[calc(100vh-9rem)] w-auto max-w-full cursor-zoom-out select-none object-contain",
              zoomedClassName
            )}
            onClick={() => setOpen(false)}
          />
        </div>
        <p className="px-2 text-center text-xs text-gray-500">{alt}</p>
      </DialogContent>
    </Dialog>
  );
}

