/**
 * A list of bots we want to block. We use this both in robots.txt and in our
 * edge function to literally blackhole the content when bots attempt to read.
 *
 * @see https://developers.netlify.com/guides/blocking-ai-bots-and-controlling-crawlers/
 */
module.exports = [
  'Adsbot-Google',
  'AhrefsBot',
  'Amazonbot',
  'Applebot',
  'anthropic-ai',
  'AwarioRssBotAwarioSmartBot',
  'Baiduspider-image',
  'Bytespider',
  'CCBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'cohere-ai',
  'DataForSeoBot',
  'dotbot',
  'Exabot',
  'FacebookBot',
  'Googlebot-Image',
  'Google-Extended',
  'GPTBot',
  'magpie-crawler',
  'Mediapartners-Google',
  'MJ12bot',
  'omgili',
  'omgilibot',
  'peer39_crawler',
  'peer39_crawler/1.0',
  'PerplexityBot',
  'PetalBot',
  'SemrushBot',
];
