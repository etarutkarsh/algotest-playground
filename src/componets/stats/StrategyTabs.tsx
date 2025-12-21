import { useState } from "react";
import PayoffPanel from "./PayoffPanel";

const tabs = ["Payoff", "Greeks", "Events"];

export default function StrategyTabs() {
  const [active, setActive] = useState("Payoff");

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-3 py-1 rounded text-sm border
              ${
                active === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {active === "Payoff" && <PayoffPanel />}
      {active === "Greeks" && <Placeholder title="Greeks coming soon" />}
      {active === "Events" && <Placeholder title="Events coming soon" />}
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="h-40 border rounded flex items-center justify-center text-gray-400">
      {title}
    </div>
  );
}
