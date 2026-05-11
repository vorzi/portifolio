"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const components: Components = {
  p({ children }) {
    const text = typeof children === "string" ? children : "";

    if (text.trim() === "{_large}") {
      return (
        <div className="w-full my-3">
          <div className="w-full h-px bg-white/20 rounded-full" />
        </div>
      );
    }

    if (text.trim() === "{_nolarge}") {
      return (
        <div className="flex justify-center my-3">
          <div className="w-16 h-px bg-white/20 rounded-full" />
        </div>
      );
    }

    return <p className="my-1 leading-relaxed text-white/75">{children}</p>;
  },

  h1: ({ children }) => (
    <h1 className="text-white text-2xl font-bold mt-5 mb-2 tracking-tight border-b border-white/10 pb-2">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-white text-xl font-semibold mt-4 mb-2 border-b border-white/10 pb-1">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-white/90 text-lg font-semibold mt-3 mb-1">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-white/80 text-base font-semibold mt-3 mb-1">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-white/70 text-sm font-semibold mt-2 mb-1">{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-white/60 text-xs font-semibold mt-2 mb-1">{children}</h6>
  ),

  strong: ({ children }) => (
    <strong className="text-white font-semibold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-white/60 italic">{children}</em>
  ),
  del: ({ children }) => (
    <del className="text-white/40 line-through">{children}</del>
  ),

  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
      {children}
    </a>
  ),

  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) return <code className={`${className} text-sm`}>{children}</code>;
    return <code className="bg-white/10 text-white/80 text-[0.85em] px-1.5 py-0.5 rounded font-mono">{children}</code>;
  },

  pre: ({ children }) => (
    <pre className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 my-3 overflow-x-auto text-sm font-mono text-white/80 leading-relaxed">
      {children}
    </pre>
  ),

  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-white/30 pl-4 my-3 text-white/50 italic">{children}</blockquote>
  ),

  ul: ({ children }) => (
    <ul className="list-disc list-inside my-2 space-y-1 text-white/75 marker:text-white/30">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside my-2 space-y-1 text-white/75 marker:text-white/30">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed pl-1">{children}</li>
  ),

  hr: () => (
    <hr className="border-none w-full h-px bg-white/15 my-4 rounded-full" />
  ),

  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm text-white/75">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-white/5 text-white/90 font-medium">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-white/5">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-white/5 transition-colors">{children}</tr>,
  th: ({ children }) => <th className="px-3 py-2 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2">{children}</td>,

  input: ({ type, checked }) => {
    if (type === "checkbox") {
      return <input type="checkbox" checked={checked} readOnly className="mr-1.5 accent-blue-400 rounded" />;
    }
    return <input type={type} />;
  },
};

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`text-sm leading-relaxed ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}