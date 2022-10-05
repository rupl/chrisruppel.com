const hljs = require('highlight.js');
const markdownIt = require('markdown-it');

module.exports = function(eleventyConfig) {
  // Define layout aliases. All paths relative to _includes
  eleventyConfig.addLayoutAlias('about', 'layouts/about.html');
  eleventyConfig.addLayoutAlias('blog', 'layouts/blog.html');
  eleventyConfig.addLayoutAlias('default', 'layouts/default.html');
  eleventyConfig.addLayoutAlias('gallery', 'layouts/gallery.html');
  eleventyConfig.addLayoutAlias('link', 'layouts/link.html');
  eleventyConfig.addLayoutAlias('naked', 'layouts/naked.html');
  eleventyConfig.addLayoutAlias('page', 'layouts/page.html');
  eleventyConfig.addLayoutAlias('quote', 'layouts/quote.html');
  eleventyConfig.addLayoutAlias('trip', 'layouts/trip.html');

  // Set directories to pass through to the dist folder
  eleventyConfig.addPassthroughCopy('./css/');
  eleventyConfig.addPassthroughCopy('./js/');
  eleventyConfig.addPassthroughCopy('./static/');
  eleventyConfig.addPassthroughCopy('./svg/');
  eleventyConfig.addPassthroughCopy('./static/');
  eleventyConfig.addPassthroughCopy('./.well-known/');

  //
  // Collections
  //
  eleventyConfig.addCollection('travel', collection =>
    collection.getFilteredByGlob('travel/_posts/*.md')
      .sort((a, b) => b.date - a.date));
  eleventyConfig.addCollection('blog', collection =>
    collection.getFilteredByGlob('blog/_posts/*.md')
      .sort((a, b) => b.date - a.date));
  eleventyConfig.addCollection('calendar', collection =>
    collection.getFilteredByGlob('calendar/_posts/*.md')
      .sort((a, b) => b.date - a.date));
  eleventyConfig.addCollection('clients', collection =>
    collection.getFilteredByGlob('clients/_posts/*.md')
      .sort((a, b) => a.data.order - b.data.order));
  eleventyConfig.addCollection('tagList', collection => {
    let tagCounts = new Map();
    collection.getAllSorted().forEach(function(item) {
      if('tags' in item.data) {
        let tags = item.data.tags;
        if (typeof tags === 'string') {
          tags = [tags];
        }

        for (const tag of tags) {
          if (tagCounts.has(tag)) {
            count = tagCounts.get(tag);
            tagCounts.set(tag, ++count);
          } else {
            tagCounts.set(tag, 1);
          }
        }
      }
    });

    return tagCounts.entries();
  });

  //
  // Markdown
  //
  let mdOptions = {
    html: true,
    breaks: false,
    linkify: false,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          // Run the highlighter and then escape HTML entities.
          return hljs.highlight(str, { language: lang }).value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        } catch (__) {}
      }

      return ''; // use external default escaping
    },
  };
  eleventyConfig.setLibrary("md", markdownIt(mdOptions));

  return {
    dir: {
      input: './',
      output: './_site',
    },
    markdownTemplateEngine: 'liquid',
  };
};
