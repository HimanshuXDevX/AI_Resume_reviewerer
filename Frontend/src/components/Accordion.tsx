import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";

const cn = (...classes: (string | Record<string, boolean> | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// --- Context and Hook ---
interface AccordionContextType {
  activeItems: string[];
  toggleItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
}
const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);
const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("Accordion components must be used within an Accordion");
  return context;
};

// --- Accordion ---
interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string;
  allowMultiple?: boolean;
  className?: string;
}
export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = "",
}) => {
  const [activeItems, setActiveItems] = useState<string[]>(
    defaultOpen ? [defaultOpen] : []
  );

  const toggleItem = (id: string) => {
    setActiveItems(prev => {
      if (allowMultiple) return prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      return prev.includes(id) ? [] : [id];
    });
  };

  const isItemActive = (id: string) => activeItems.includes(id);

  return (
    <AccordionContext.Provider value={{ activeItems, toggleItem, isItemActive }}>
      <div className={cn(
        "space-y-1.5 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900",
        className
      )}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// --- AccordionItem ---
interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}
export const AccordionItem: React.FC<AccordionItemProps> = ({ id, children, className = "" }) => (
  <div className={cn(
    "overflow-hidden border border-gray-700 rounded-md",
    className
  )}>
    {children}
  </div>
);

// --- AccordionHeader ---
interface AccordionHeaderProps {
  itemId: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}
export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  itemId,
  children,
  className = "",
  icon,
  iconPosition = "right",
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  const defaultIcon = (
    <svg
      className={`w-3 h-3 transition-transform duration-200 text-gray-400 ${isActive ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <button
      onClick={() => toggleItem(itemId)}
      className={cn(
        "w-full px-2 py-1 text-left text-sm flex items-center justify-between cursor-pointer bg-gray-900 hover:bg-gray-800 text-white transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500",
        className
      )}
    >
      <div className="flex items-center space-x-1">
        {iconPosition === "left" && (icon || defaultIcon)}
        <div className="flex-1 font-medium">{children}</div>
      </div>
      {iconPosition === "right" && (icon || defaultIcon)}
    </button>
  );
};

// --- AccordionContent ---
interface AccordionContentProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}
export const AccordionContent: React.FC<AccordionContentProps> = ({
  itemId,
  children,
  className = "",
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  return (
    <div className={cn(
      "overflow-hidden transition-all duration-300 ease-in-out",
      isActive ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
    )}>
      <div
        className={cn(
          "px-2 py-1 bg-gray-950/50 text-gray-200 text-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900",
          className
        )}
        style={{ maxHeight: "240px" }}
      >
        {/* remove default margin/padding inside */}
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
};