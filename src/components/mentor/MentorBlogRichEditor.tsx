"use client";

import React from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { cn } from "@/lib/utils";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Subscript as SubIcon,
  Superscript as SuperIcon,
  Underline,
  Undo2,
} from "lucide-react";

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"];
const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
  { label: "Courier New", value: '"Courier New", monospace' },
  { label: "Verdana", value: "Verdana, sans-serif" },
];

type MentorBlogRichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-transparent px-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40",
        active && "border-primary/40 bg-primary/15 text-primary"
      )}
    >
      {children}
    </button>
  );
}

/** Re-read active state on every transaction so toolbar matches cursor/selection. */
function MentorBlogToolbar({ editor }: { editor: Editor }) {
  const t = useEditorState({
    editor,
    selector: ({ editor: ed, transactionNumber: n }) => {
      const textStyle = ed.getAttributes("textStyle") as {
        color?: string | null;
        fontSize?: string | null;
        fontFamily?: string | null;
        lineHeight?: string | null;
      };
      const highlightAttrs = ed.getAttributes("highlight") as { color?: string | null };

      const textAlign =
        (ed.getAttributes("paragraph") as { textAlign?: string | null }).textAlign ??
        (ed.getAttributes("heading") as { textAlign?: string | null }).textAlign ??
        (ed.getAttributes("blockquote") as { textAlign?: string | null }).textAlign ??
        null;

      const alignLeft =
        textAlign === "left" ||
        textAlign === null ||
        textAlign === undefined ||
        textAlign === "";
      const alignCenter = textAlign === "center";
      const alignRight = textAlign === "right";
      const alignJustify = textAlign === "justify";

      return {
        n,
        bold: ed.isActive("bold"),
        italic: ed.isActive("italic"),
        underline: ed.isActive("underline"),
        strike: ed.isActive("strike"),
        code: ed.isActive("code"),
        link: ed.isActive("link"),
        bulletList: ed.isActive("bulletList"),
        orderedList: ed.isActive("orderedList"),
        blockquote: ed.isActive("blockquote"),
        codeBlock: ed.isActive("codeBlock"),
        h1: ed.isActive("heading", { level: 1 }),
        h2: ed.isActive("heading", { level: 2 }),
        h3: ed.isActive("heading", { level: 3 }),
        paragraph:
          ed.isActive("paragraph") &&
          !ed.isActive("heading") &&
          !ed.isActive("codeBlock") &&
          !ed.isActive("blockquote"),
        sub: ed.isActive("subscript"),
        sup: ed.isActive("superscript"),
        highlight: ed.isActive("highlight"),
        alignLeft,
        alignCenter,
        alignRight,
        alignJustify,
        fontSize: textStyle.fontSize ?? "",
        fontFamily: textStyle.fontFamily ?? "",
        lineHeight: textStyle.lineHeight ?? "",
        textColor: textStyle.color && /^#[0-9A-Fa-f]{6}$/i.test(textStyle.color) ? textStyle.color : "#e2e8f0",
        highlightColor:
          highlightAttrs.color && /^#[0-9A-Fa-f]{6}$/i.test(highlightAttrs.color)
            ? highlightAttrs.color
            : "#fef08a",
      };
    },
  });

  const setLink = React.useCallback(() => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    const trimmed = url.trim();
    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-white/10 bg-[#111]/90 px-2 py-2">
      <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
      <span className="mx-1 h-6 w-px bg-white/10" />

      <ToolbarButton
        title="Heading 1"
        active={t.h1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 2"
        active={t.h2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        active={t.h3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Normal text (paragraph)"
        active={t.paragraph}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <span className="text-[10px] font-bold px-0.5">¶</span>
      </ToolbarButton>
      <span className="mx-1 h-6 w-px bg-white/10" />

      <ToolbarButton
        title="Bold"
        active={t.bold}
        onClick={() => editor.chain().focus().extendMarkRange("bold").toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={t.italic}
        onClick={() => editor.chain().focus().extendMarkRange("italic").toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={t.underline}
        onClick={() => editor.chain().focus().extendMarkRange("underline").toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        active={t.strike}
        onClick={() => editor.chain().focus().extendMarkRange("strike").toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Inline code"
        active={t.code}
        onClick={() => editor.chain().focus().extendMarkRange("code").toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>
      <span className="mx-1 h-6 w-px bg-white/10" />

      <ToolbarButton title="Link" active={t.link} onClick={setLink}>
        <Link2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Bullet list"
        active={t.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        active={t.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Quote"
        active={t.blockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Code block"
        active={t.codeBlock}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <span className="text-[10px] font-mono">{`{ }`}</span>
      </ToolbarButton>
      <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </ToolbarButton>
      <span className="mx-1 h-6 w-px bg-white/10" />

      <ToolbarButton
        title="Align left"
        active={t.alignLeft}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align center"
        active={t.alignCenter}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align right"
        active={t.alignRight}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Justify"
        active={t.alignJustify}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>
      <span className="mx-1 h-6 w-px bg-white/10" />

      <label className="inline-flex items-center gap-1 px-1" title="Text color">
        <span className="text-[9px] uppercase tracking-wider text-slate-500">A</span>
        <input
          key={`tc-${t.n}`}
          type="color"
          className="h-7 w-9 cursor-pointer rounded border border-white/10 bg-transparent p-0"
          value={t.textColor}
          onChange={(e) => {
            const c = e.target.value;
            editor.chain().focus().setColor(c).run();
          }}
        />
      </label>
      <label className="inline-flex items-center gap-1 px-1" title="Highlight (select text first)">
        <Highlighter className="h-3.5 w-3.5 text-slate-500" />
        <input
          key={`hi-${t.n}`}
          type="color"
          className="h-7 w-9 cursor-pointer rounded border border-white/10 bg-transparent p-0"
          value={t.highlightColor}
          onChange={(e) => {
            const c = e.target.value;
            editor.chain().focus().extendMarkRange("highlight").setHighlight({ color: c }).run();
          }}
        />
      </label>

      <select
        key={`fs-${t.n}`}
        className="h-8 max-w-[120px] rounded-lg border border-white/10 bg-[#1c1c1c] px-2 text-[11px] text-slate-200"
        title="Font size"
        value={t.fontSize}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) editor.chain().focus().unsetFontSize().run();
          else editor.chain().focus().setFontSize(v).run();
        }}
      >
        <option value="">Size</option>
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        key={`ff-${t.n}`}
        className="h-8 max-w-[130px] rounded-lg border border-white/10 bg-[#1c1c1c] px-2 text-[11px] text-slate-200"
        title="Font family"
        value={t.fontFamily}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) editor.chain().focus().unsetFontFamily().run();
          else editor.chain().focus().setFontFamily(v).run();
        }}
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        key={`lh-${t.n}`}
        className="h-8 max-w-[100px] rounded-lg border border-white/10 bg-[#1c1c1c] px-2 text-[11px] text-slate-200"
        title="Line height"
        value={t.lineHeight}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) editor.chain().focus().unsetLineHeight().run();
          else editor.chain().focus().setLineHeight(v).run();
        }}
      >
        <option value="">Line</option>
        <option value="1">1</option>
        <option value="1.25">1.25</option>
        <option value="1.5">1.5</option>
        <option value="1.75">1.75</option>
        <option value="2">2</option>
      </select>

      <span className="mx-1 h-6 w-px bg-white/10" />

      <ToolbarButton
        title="Subscript"
        active={t.sub}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      >
        <SubIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Superscript"
        active={t.sup}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <SuperIcon className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Clear formatting"
        onClick={() =>
          editor.chain().focus().unsetAllMarks().unsetHighlight().unsetTextAlign().run()
        }
      >
        <RemoveFormatting className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

export function MentorBlogRichEditor({
  value,
  onChange,
  placeholder = "Write your blog content… Use the toolbar for headings, colors, lists, and more.",
}: MentorBlogRichEditorProps) {
  const lastEmitted = React.useRef(value);
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          link: {
            openOnClick: false,
            HTMLAttributes: {
              class: "text-primary underline underline-offset-2 font-medium",
            },
          },
        }),
        TextStyleKit,
        TextAlign.configure({
          types: ["heading", "paragraph", "blockquote"],
        }),
        Highlight.configure({ multicolor: true }),
        Placeholder.configure({ placeholder }),
        Subscript,
        Superscript,
      ],
      content: value || "",
      editorProps: {
        attributes: {
          class:
            "prose prose-invert max-w-none min-h-[280px] focus:outline-none px-4 py-3 " +
            "prose-headings:font-semibold prose-a:text-primary prose-p:my-2 prose-ul:my-2 prose-ol:my-2 " +
            "[&_mark]:rounded [&_mark]:px-0.5 [&_mark]:text-inherit",
        },
      },
      onUpdate: ({ editor: ed }) => {
        const html = ed.getHTML();
        lastEmitted.current = html;
        onChangeRef.current(html);
      },
    },
    []
  );

  React.useEffect(() => {
    if (!editor) return;
    if (value === lastEmitted.current) return;
    lastEmitted.current = value;
    editor.commands.setContent(value || "", false);
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] min-h-[320px] flex items-center justify-center text-sm text-slate-500">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
      <MentorBlogToolbar editor={editor} />
      <EditorContent editor={editor} className="max-h-[min(70vh,720px)] overflow-y-auto bg-[#1c1c1c]/80" />
    </div>
  );
}
