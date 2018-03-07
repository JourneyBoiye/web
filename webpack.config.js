var path = require("path");
module.exports = {
  entry: './docs/journey.js',
  output: {
    path: path.resolve(__dirname, "docs/js/dist"),
    filename: "bundle.js"
  },
  target: "node",
  mode: "development"
};
