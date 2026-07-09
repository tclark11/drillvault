import { useState } from "react";
import SportSelect from "./SportSelect";
import DrillVault from "./DrillVault";

export default function App() {
  const [selectedSport, setSelectedSport] = useState(null);

  if (selectedSport) {
    return <DrillVault sport={selectedSport} onBack={() => setSelectedSport(null)} />;
  }

  return <SportSelect onSelect={setSelectedSport} />;
}
