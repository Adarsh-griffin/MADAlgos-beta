"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AssessmentMarkdownProps = {
  /** Markdown source (GFM: tables, strikethrough, autolinks, task lists). */
  children: string;
  className?: string;
};

/**
 * Renders assessment copy (problem descriptions, etc.) as Markdown with TestPortal dark styling.
 */
export function AssessmentMarkdown({ children, className = "" }: AssessmentMarkdownProps) {
  const src = children?.trim() ? children : "_No description provided._";

  /* react-markdown injects AST `node` into custom components; we strip it from DOM spread. */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const mdComponents = {
    h1: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"h1">) => (
      <h1 className="text-xl font-bold text-white mt-6 mb-3 first:mt-0" {...props} />
    ),
    h2: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"h2">) => (
      <h2 className="text-lg font-semibold text-white mt-5 mb-2" {...props} />
    ),
    h3: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"h3">) => (
      <h3 className="text-base font-semibold text-white mt-4 mb-2" {...props} />
    ),
    h4: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"h4">) => (
      <h4 className="text-sm font-semibold text-slate-200 mt-3 mb-1.5" {...props} />
    ),
    p: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"p">) => (
      <p className="mb-3 last:mb-0 text-slate-300" {...props} />
    ),
    ul: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"ul">) => (
      <ul className="list-disc pl-5 mb-3 space-y-1 text-slate-300" {...props} />
    ),
    ol: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"ol">) => (
      <ol className="list-decimal pl-5 mb-3 space-y-1 text-slate-300" {...props} />
    ),
    li: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"li">) => (
      <li className="leading-relaxed" {...props} />
    ),
    a: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"a">) => (
      <a
        className="text-primary underline underline-offset-2 hover:text-primary/80"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    code: ({
      className,
      children: codeChildren,
      node,
      ...props
    }: {
      node?: unknown;
      className?: string;
      children?: React.ReactNode;
    } & React.ComponentPropsWithoutRef<"code">) => {
      const isBlock = !!(className && String(className).includes("language-"));
      if (isBlock) {
        return (
          <code className={`block whitespace-pre text-xs font-mono ${className || ""}`} {...props}>
            {codeChildren}
          </code>
        );
      }
      return (
        <code className="px-1 py-0.5 rounded bg-white/10 text-primary text-[0.9em] font-mono" {...props}>
          {codeChildren}
        </code>
      );
    },
    pre: ({ node, children, ...props }: { node?: unknown; children?: React.ReactNode } & React.ComponentPropsWithoutRef<"pre">) => (
      <pre
        className="my-3 overflow-x-auto rounded-lg border border-white/10 bg-black/60 p-3 text-xs font-mono text-slate-200"
        {...props}
      >
        {children}
      </pre>
    ),
    blockquote: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote className="border-l-2 border-primary/50 pl-3 my-3 text-slate-400 italic" {...props} />
    ),
    hr: () => <hr className="my-6 border-white/10" />,
    table: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"table">) => (
      <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
        <table className="w-full text-xs border-collapse" {...props} />
      </div>
    ),
    thead: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"thead">) => (
      <thead className="bg-white/5 text-slate-200" {...props} />
    ),
    th: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"th">) => (
      <th className="border border-white/10 px-3 py-2 text-left font-semibold" {...props} />
    ),
    td: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"td">) => (
      <td className="border border-white/10 px-3 py-2 align-top" {...props} />
    ),
    strong: ({ node, ...props }: { node?: unknown } & React.ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-semibold text-white" {...props} />
    ),
  };
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return (
    <div
      className={`assessment-markdown text-slate-300 text-sm leading-relaxed [&_*]:max-w-none ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {src}
      </ReactMarkdown>
    </div>
  );
}
