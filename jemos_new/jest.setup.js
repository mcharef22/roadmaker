// Global test setup for jest
// Provide minimal window.google.maps mock used across components
global.window = global.window || {};
global.window.google = global.window.google || {};
global.window.google.maps = global.window.google.maps || {
  TravelMode: {
    DRIVING: "DRIVING",
    BICYCLING: "BICYCLING",
    WALKING: "WALKING",
    TWO_WHEELER: "TWO_WHEELER",
  },
};

// Provide URL.createObjectURL for tests that use it
if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = () => "blob:http://localhost/fake";
}

// Basic matchMedia mock
if (!global.window.matchMedia) {
  global.window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  });
}

// Polyfill requestSubmit for jsdom
if (
  typeof HTMLFormElement !== "undefined" &&
  !HTMLFormElement.prototype.requestSubmit
) {
  HTMLFormElement.prototype.requestSubmit = function () {
    return this.submit();
  };
}

// Polyfill Element.getAnimations used by some libraries (sweetalert2)
if (typeof Element !== "undefined" && !Element.prototype.getAnimations) {
  Element.prototype.getAnimations = function () {
    return [];
  };
}
