import ReactMarkdown from "react-markdown";
import { ExternalLink, Sparkles } from "lucide-react";

interface AIArticleRendererProps {
  content: string;
  className?: string;
}

export default function AIArticleRenderer({ content, className = "" }: AIArticleRendererProps) {
  const now = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className={`glass-card p-8 sm:p-10 ${className}`}>
      <div className="ai-article">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-6 pb-3 border-b border-border/50">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="flex items-start gap-3 text-xl font-serif font-bold text-foreground mt-8 mb-4">
                <span className="shrink-0 w-1 h-7 rounded-full bg-primary mt-0.5" />
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-serif font-semibold text-foreground mt-6 mb-3 pl-4 border-l-2 border-primary/30">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-[15px] leading-relaxed text-foreground/80 mb-4">
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-foreground">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="text-primary/90 not-italic font-medium">{children}</em>
            ),
            blockquote: ({ children }) => (
              <div className="my-5 rounded-xl bg-primary/5 border border-primary/15 p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl" />
                <div className="pl-3 text-[14px] leading-relaxed text-foreground/85 [&>p]:mb-0">
                  {children}
                </div>
              </div>
            ),
            ul: ({ children }) => (
              <ul className="my-4 space-y-2.5 pl-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="my-4 space-y-2.5 pl-1 counter-reset-section">{children}</ol>
            ),
            li: ({ children, ...props }) => {
              const isOrdered = (props as any).ordered;
              return (
                <li className="flex items-start gap-2.5 text-[14px] leading-relaxed text-foreground/80">
                  {isOrdered ? (
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                      {(props as any).index + 1}
                    </span>
                  ) : (
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  )}
                  <span className="flex-1">{children}</span>
                </li>
              );
            },
            hr: () => (
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            ),
            table: ({ children }) => (
              <div className="my-6 overflow-x-auto rounded-xl border border-border/50">
                <table className="w-full text-sm">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-primary/5 border-b border-border/50">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                {children}
              </th>
            ),
            tr: ({ children, ...props }) => (
              <tr className="border-b border-border/30 even:bg-muted/30 hover:bg-muted/50 transition-colors">
                {children}
              </tr>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-[13px] text-foreground/80">{children}</td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/30 transition-colors text-[13px] font-medium"
              >
                {children}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            ),
            code: ({ children, className }) => {
              const isBlock = className?.includes("language-");
              if (isBlock) {
                return (
                  <code className="block bg-muted/50 rounded-lg p-4 text-xs font-mono text-foreground/80 overflow-x-auto border border-border/30">
                    {children}
                  </code>
                );
              }
              return (
                <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[13px] font-medium">
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary/60" />
          <span>Gerado por <span className="font-semibold text-foreground/60">AZERA AI</span></span>
        </div>
        <span className="text-[11px] text-muted-foreground">{now}</span>
      </div>
    </article>
  );
}
