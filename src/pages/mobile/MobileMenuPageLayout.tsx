import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface MobileMenuPageLayoutProps {
  title: string;
  onBack?: () => void;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onChatClick?: () => void;
  children: ReactNode;
}

export function MobileMenuPageLayout({
  title,
  onBack,
  tabs,
  activeTab,
  onTabChange,
  onChatClick,
  children,
}: MobileMenuPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </motion.button>
            )}
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </div>

          {onChatClick && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onChatClick}
              className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 text-primary" />
            </motion.button>
          )}
        </div>

        {/* Tab Navigation */}
        {tabs && tabs.length > 0 && (
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === tab.id
                    ? "bg-foreground text-background"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-safe">
        {children}
      </main>
    </div>
  );
}
