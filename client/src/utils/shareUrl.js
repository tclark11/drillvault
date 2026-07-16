export function buildShareUrl({ sport, term, videoId }) {
  const p = new URLSearchParams();
  if (sport) p.set('sport', sport);
  if (term) p.set('drill', term);
  if (videoId) p.set('v', videoId);
  return `${window.location.origin}/?${p.toString()}`;
}

export function readShareParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    sport: p.get('sport'),
    term: p.get('drill'),
    videoId: p.get('v'),
  };
}

// Keeps the address bar in sync without a page reload
export function syncUrl({ sport, term, videoId }) {
  const p = new URLSearchParams();
  if (sport) p.set('sport', sport);
  if (term) p.set('drill', term);
  if (videoId) p.set('v', videoId);
  const qs = p.toString();
  window.history.pushState({ sport, term, videoId }, '', qs ? `/?${qs}` : '/');
}