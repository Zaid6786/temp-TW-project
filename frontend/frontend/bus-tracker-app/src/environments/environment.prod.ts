export const environment = {
  production: true,
  get apiUrl() { return `/api`; },
  mapboxToken: 'pk.eyJ1IjoicGF2YW5rdW1hcnN3YW15IiwiYSI6ImNtNnc1c3ZpdTBkdGgyanM5b25rN2ZqcncifQ.Ls1e2W6rx3apoBsStWa5Ow',
  get websocketUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  },
  get genaiUrl() { return `/genai`; }
};
