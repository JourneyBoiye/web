var path = require("path");
module.exports = {
  entry: './docs/journey.js',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  target: "node",
  mode: "development"
};
