module.exports = function (eleventyConfig) {
  // Static passthrough
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Watch CSS for changes during --serve
  eleventyConfig.addWatchTarget("src/css/");

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  return {
    dir: {
      input: "content",
      includes: "../src/_includes",
      data: "../src/_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
