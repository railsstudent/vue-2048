// vue.config.js
module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/vue-2048/" : "/",
    outputDir: "dist",
    lintOnSave: process.env.NODE_ENV !== "production",
    devServer: {
        overlay: {
            warnings: true,
            errors: true,
        },
    },
};
