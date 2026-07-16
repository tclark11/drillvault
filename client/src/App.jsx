import { useState, useEffect } from "react";
import SportSelect from "./SportSelect";
import DrillVault from "./DrillVault";
import { SPORTS_CONFIG } from "./sportsdata";

export default function App() {
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

  const [showSaved, setShowSaved] = useState(false);

  // Read sport from URL path e.g. /basketball
  const getSportFromURL = () => {
    const path = window.location.pathname.replace("/", "").toLowerCase();
    return SPORTS_CONFIG[path] ? path : null;
  };

  const [currentSportId, setCurrentSportId] = useState(getSportFromURL);

  // Read drill + video from the shared link
  const getDeepLink = () => {
    const p = new URLSearchParams(window.location.search);
    return { termId: p.get("drill"), videoId: p.get("v") };
  };
  const [deepLink, setDeepLink] = useState(getDeepLink);

  const navigateTo = (sportId) => {
    if (sportId) {
      window.history.pushState({}, "", `/${sportId}`);
      setCurrentSportId(sportId);
    } else {
      window.history.pushState({}, "", "/");
      setCurrentSportId(null);
    }
    setDeepLink({ termId: null, videoId: null });
    setShowSaved(false);
    window.scrollTo({ top: 0 });
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handler = () => {
      setCurrentSportId(getSportFromURL());
      setDeepLink(getDeepLink());
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

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

  if (currentSportId) {
    const config = SPORTS_CONFIG[currentSportId];
    const sport = { id: currentSportId, label: config.label, emoji: config.emoji };
    return (
      <DrillVault
        sport={sport}
        deepLink={deepLink}
        onBack={() => navigateTo(null)}
        saved={saved}
        savedVideos={savedVideos}
        toggleSave={toggleSave}
        savedCount={savedCount}
      />
    );
  }

  return (
    <SportSelect
      onSelect={(sport) => navigateTo(sport.id)}
      savedCount={savedCount}
      onShowSaved={() => setShowSaved(true)}
      savedVideos={savedVideos}
      saved={saved}
      toggleSave={toggleSave}
      showSaved={showSaved}
      onHideSaved={() => setShowSaved(false)}
    />
  );
}