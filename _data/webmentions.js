const fetch = require('node-fetch');
const API_ORIGIN = 'https://webmention.io/api/mentions.jf2';
const legacyMentions = require('./legacyWebmentions');

function enrichSummary(source, summary) {
  var isSourceTwitter = source.indexOf('twitter.com') !== -1;
  var output = summary;

  if (isSourceTwitter) {
    // Hashtags
    output = output.replace(/#(\w+)/g, '<a href="https://twitter.com/hashtag/$1">#$1</a>');
    // Users
    output = output.replace(/@(\w+)/g, '<a href="https://twitter.com/$1">@$1</a>');
  }

  return output;
}

module.exports = async () => {
  const domain = 'chrisruppel.com';
  const token = process.env.WEBMENTION_IO_TOKEN;
  const url = `${API_ORIGIN}?domain=${domain}&token=${token}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const feed = await response.json();
      const output = feed.children.concat(legacyMentions);

      // Jazz up our summaries.
      output.forEach(mention => {
        if (typeof mention.content.html === 'undefined') {
          mention.content.html = enrichSummary(mention['wm-source'], mention.content.text);
        }
      });

      return output;
    } else {
      throw response;
    }
  } catch (err) {
    console.error('🔥 webmentions.js', err);
    return [];
  }
}
