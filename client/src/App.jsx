import { useState } from "react";
import SportSelect from "./SportSelect";
import DrillVault from "./DrillVault";

export default function App() {
  const [selectedSport, setSelectedSport] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  const [saved, setSaved] = useState(() => {
    try {
      const s = localStorage.getItem("drillvault_saved");
      return s ? JSON.parse(s) : {};
    } catch { return {}; }
  });

  const [savedVideos, setSavedVideos] = useState(() => {
    try {
      const v = localStorage.getItem("drillvault_saved_videos");
      return v ? JSON.parse(v) : [];
    } catch { return []; }
  });

  const toggleSave = (videoId, video) => {
    setSaved(prev => {
      const next = { ...prev };
      if (next[videoId]) {
        delete next[videoId];
        setSavedVideos(l => {
          const updated = l.filter(v => (v.id?.videoId || v.id) !== videoId);
          localStorage.setItem("drillvault_saved_videos", JSON.stringify(updated));
          return updated;
        });
      } else {
        next[videoId] = true;
        if (video) {
          setSavedVideos(l => {
            const updated = [...l, video];
            localStorage.setItem("drillvault_saved_videos", JSON.stringify(updated));
            return updated;
          });
        }
      }
      localStorage.setItem("drillvault_saved", JSON.stringify(next));
      return next;
    });
  };

  const savedCount = Object.keys(saved).length;

  if (selectedSport && !showSaved) {
    return (
      <DrillVault
        sport={selectedSport}
        onBack={() => setSelectedSport(null)}
        saved={saved}
        savedVideos={savedVideos}
        toggleSave={toggleSave}
        savedCount={savedCount}
        onShowSaved={() => setShowSaved(true)}
      />
    );
  }

  return (
    <>
      <SportSelect
        onSelect={(sport) => { setSelectedSport(sport); setShowSaved(false); }}
        savedCount={savedCount}
        onShowSaved={() => setShowSaved(true)}
        savedVideos={savedVideos}
        saved={saved}
        toggleSave={toggleSave}
        showSaved={showSaved}
        onHideSaved={() => setShowSaved(false)}
      />
    </>
  );
}