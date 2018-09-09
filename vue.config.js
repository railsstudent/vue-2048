// vue.config.js
module.exports = {
  baseUrl: process.env.NODE_ENV === "production" ? "/vue-2048/" : "/",
  outputDir: "dist",
  lintOnSave: true
};
