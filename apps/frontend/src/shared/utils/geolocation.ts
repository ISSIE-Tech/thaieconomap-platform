// if userLocation exist, shows direction
// if userLocation doesn't exist (user not allow), shows destination only
export const getDirection = (destination: [number, number], source: [number, number] | null) =>
  source
    ? `https://www.google.com/maps/dir/?api=1&origin=${source[0]},${source[1]}&destination=${destination[0]},${destination[1]}&dir_action=navigate`
    : `https://www.google.com/maps/search/?api=1&query=${destination[0]}%2C${destination[1]}`;
