import type { LucideIcon } from "lucide-react";

type Capability = { icon: LucideIcon; copy: string };

/** Five framed capability cards. Icons draw themselves in when the row scrolls into view. */
export default function Capabilities({ items }: { items: Capability[] }) {
  return (
    <ul className="capabilities">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <li key={item.copy} data-reveal style={{ "--i": index } as React.CSSProperties}>
            <span className="capability-icon" aria-hidden="true"><Icon size={26} strokeWidth={1.3} /></span>
            <span className="capability-scan" aria-hidden="true" />
            <p>{item.copy}</p>
          </li>
        );
      })}
    </ul>
  );
}
