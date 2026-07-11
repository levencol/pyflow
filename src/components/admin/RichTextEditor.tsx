import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { Bold, Italic, Heading3, List, ListOrdered, Code, SquareTerminal, Quote } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-2 border-b border-slate-200 dark:border-slate-700">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-slate-300 dark:bg-slate-600' : 'hover:bg-slate-200 dark:hover:bg-slate-700'} text-slate-700 dark:text-slate-300`}
        title="Gras"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-slate-300 dark:bg-slate-600' : 'hover:bg-slate-200 dark:hover:bg-slate-700'} text-slate-700 dark:text-slate-300`}
        title="Italique"
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-300 dark:bg-slate-600' : 'hover:bg-slate-200 dark:hover:bg-slate-700'} text-slate-700 dark:text-slate-300`}
        title="Titre (H3)"
      >
        <Heading3 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-slate-300 dark:bg-slate-600' : 'hover:bg-slate-200 dark:hover:bg-slate-700'} text-slate-700 dark:text-slate-300`}
        title="Liste à puces"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-slate-300 dark:bg-slate-600' : 'hover:bg-slate-200 dark:hover:bg-slate-700'} text-slate-700 dark:text-slate-300`}
        title="Liste numérotée"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 self-center"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('code') ? 'bg-slate-300 dark:bg-slate-600' : 'hover:bg-slate-200 dark:hover:bg-slate-700'} text-slate-700 dark:text-slate-300`}
        title="Code en ligne"
      >
        <Code className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('codeBlock') ? 'bg-slate-300 dark:bg-slate-600' : 'hover:bg-slate-200 dark:hover:bg-slate-700'} text-slate-700 dark:text-slate-300`}
        title="Bloc de code"
      >
        <SquareTerminal className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-slate-300 dark:bg-slate-600' : 'hover:bg-slate-200 dark:hover:bg-slate-700'} text-slate-700 dark:text-slate-300`}
        title="Citation"
      >
        <Quote className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // Extract Markdown from Tiptap whenever content changes
      const markdown = editor.storage.markdown.getMarkdown();
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: 'tiptap min-h-[300px] p-4 text-slate-900 dark:text-white',
      },
    },
  });

  // Keep editor content in sync with external value changes
  useEffect(() => {
    if (editor && value !== editor.storage.markdown.getMarkdown()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <>
      <style>{`
        .tiptap {
          outline: none;
        }
        .tiptap p {
          color: #334155; /* text-slate-700 */
          line-height: 2; /* leading-loose */
          font-size: 1rem; /* text-base */
          margin-bottom: 1.25rem; /* mb-5 */
          font-family: ui-sans-serif, system-ui, sans-serif;
        }
        .dark .tiptap p {
          color: #cbd5e1; /* dark:text-slate-300 */
        }
        .tiptap h3 {
          font-family: ui-sans-serif, system-ui, sans-serif; /* font-display is usually sans */
          font-size: 1.125rem; /* text-lg */
          font-weight: 700; /* font-bold */
          color: #4338ca; /* text-indigo-700 */
          margin-top: 1.5rem; /* mt-6 */
          margin-bottom: 0.75rem; /* mb-3 */
        }
        .dark .tiptap h3 {
          color: #818cf8; /* dark:text-indigo-400 */
        }
        .tiptap strong {
          font-weight: 700;
          color: #0f172a; /* text-slate-900 */
        }
        .dark .tiptap strong {
          color: #fff; /* dark:text-white */
        }
        .tiptap em {
          font-style: italic;
          color: #475569; /* text-slate-600 */
        }
        .dark .tiptap em {
          color: #94a3b8; /* dark:text-slate-400 */
        }
        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.5rem; /* pl-6 */
          margin-bottom: 1.25rem; /* mb-5 */
        }
        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .tiptap li {
          line-height: 1.625;
          margin-bottom: 0.5rem;
          color: #334155;
        }
        .dark .tiptap li {
          color: #cbd5e1;
        }
        .tiptap code {
          background-color: #f1f5f9; /* bg-slate-100 */
          color: #4f46e5; /* text-indigo-600 */
          padding: 0.125rem 0.375rem; /* px-1.5 py-0.5 */
          border-radius: 0.25rem; /* rounded */
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875rem; /* text-sm */
        }
        .dark .tiptap code {
          background-color: #1e293b; /* dark:bg-slate-800 */
          color: #818cf8; /* dark:text-indigo-400 */
        }
        .tiptap pre {
          background-color: #020617; /* bg-slate-950 */
          border: 1px solid #1e293b; /* border-slate-800 */
          padding: 1rem; /* p-4 */
          border-radius: 0.75rem; /* rounded-xl */
          margin-top: 1rem;
          margin-bottom: 1rem;
          overflow-x: auto;
        }
        .tiptap pre code {
          background-color: transparent;
          color: #e2e8f0; /* text-slate-200 */
          padding: 0;
          font-size: 0.75rem; /* text-xs */
        }
        .tiptap blockquote {
          border-left: 4px solid #818cf8; /* border-indigo-400 */
          background-color: rgba(238, 242, 255, 0.5); /* bg-indigo-50/50 */
          padding: 1.25rem; /* p-5 */
          margin: 1.5rem 0; /* my-6 */
          border-top-right-radius: 1rem; /* rounded-r-2xl */
          border-bottom-right-radius: 1rem;
          color: #312e81; /* text-indigo-900 */
          font-style: italic;
        }
        .dark .tiptap blockquote {
          border-left-color: #6366f1; /* dark:border-indigo-500 */
          background-color: rgba(99, 102, 241, 0.1); /* dark:bg-indigo-500/10 */
          color: #c7d2fe; /* dark:text-indigo-200 */
        }
      `}</style>
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className="custom-scrollbar overflow-y-auto max-h-[600px] bg-slate-50 dark:bg-slate-800/50" />
      </div>
    </>
  );
}
