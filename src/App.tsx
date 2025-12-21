import OptionChain from "./componets/OptionChain/OptionChain";
import PositionsTable from "./componets/positions/PositionsTable";
import StatsPanel from "./componets/stats/StatsPanel";
import StrategyTabs from "./componets/stats/StrategyTabs";

export default function App() {
  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      {/* LEFT: OPTION CHAIN */}
      <div className="w-1/2 h-full border-r bg-white overflow-hidden">
        <OptionChain />
        <PositionsTable />


      </div>

      {/* RIGHT: STRATEGY */}
      <div className="w-1/2 h-full flex flex-col overflow-hidden p-4 gap-4">
        <PositionsTable />
        <StatsPanel />
        <div className="flex-1 overflow-hidden">
          <StrategyTabs />
        </div>
      </div>
    </div>
  );
}
