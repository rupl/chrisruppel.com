const hljs = require('highlight.js');
const markdownIt = require('markdown-it');
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssMin = require('postcss-csso');

module.exports = function(config) {
  // Define layout aliases. All paths relative to _includes
  config.addLayoutAlias('about', 'layouts/about.html');
  config.addLayoutAlias('blog', 'layouts/blog.html');
  config.addLayoutAlias('default', 'layouts/default.html');
  config.addLayoutAlias('gallery', 'layouts/gallery.html');
  config.addLayoutAlias('link', 'layouts/link.html');
  config.addLayoutAlias('naked', 'layouts/naked.html');
  config.addLayoutAlias('page', 'layouts/page.html');
  config.addLayoutAlias('quote', 'layouts/quote.html');
  config.addLayoutAlias('trip', 'layouts/trip.html');

  // Set directories to pass through to the dist folder
  config.addPassthroughCopy('./js/');
  config.addPassthroughCopy('./static/');
  config.addPassthroughCopy('./svg/');
  config.addPassthroughCopy('./static/');
  config.addPassthroughCopy('./.well-known/');

  //
  // Collections
  //
  config.addCollection('travel', collection =>
    collection.getFilteredByGlob('travel/_posts/*.md')
      .sort((a, b) => b.date - a.date));
  config.addCollection('blog', collection =>
    collection.getFilteredByGlob('blog/_posts/*.md')
      .sort((a, b) => b.date - a.date));
  config.addCollection('calendar', collection =>
    collection.getFilteredByGlob('calendar/_posts/*.md')
      .sort((a, b) => b.date - a.date));
  config.addCollection('clients', collection =>
    collection.getFilteredByGlob('clients/_posts/*.md')
      .sort((a, b) => a.data.order - b.data.order));
  config.addCollection('tagList', collection => {
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
  config.setLibrary('md', markdownIt(mdOptions));

  //
  // CSS Pipeline
  //
  config.addTemplateFormats('css');
  config.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (content, path) => {
      return async (data) => {
        // `data` holds the full data cascade. CSS was getting output inside the
        // default HTML template so we set it to null here.
        data.layout = null;

        // PostCSS
        let output = await postcss([
          postcssImport,
          postcssMin,
        ]).process(content, {
          from: path,
        });

        return output.css;
      }
    },
  });

  return {
    dir: {
      input: './',
      output: './_site',
    },
    markdownTemplateEngine: 'liquid',
  };
};
