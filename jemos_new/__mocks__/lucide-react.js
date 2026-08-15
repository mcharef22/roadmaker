const React = require("react");

// Return a simple component for any icon/name
function Icon() {
  return React.createElement("svg", null);
}

// Proxy to return Icon for any named export
const handler = {
  get: function (target, prop) {
    if (prop === "default") return Icon;
    return Icon;
  },
};

module.exports = new Proxy({}, handler);
