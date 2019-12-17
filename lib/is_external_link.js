'use strict';

const { parse, URL } = require('url');
const cache = {};

/**
 * Check whether the link is external
 * @param {String} input The url to check
 * @returns {Boolean} True if the link doesn't have protocol or link has same host with config.url
 */

function isExternalLink(input, sitehost, exclude) {
  sitehost = parse(sitehost).hostname || sitehost;

  if (!sitehost) return false;

  const cacheId = `${input}-${sitehost}-${exclude}`;

  if (cache[cacheId] !== undefined) return cache[cacheId];

  // handle relative url
  const data = new URL(input, `http://${sitehost}`);

  // handle mailto: javascript: vbscript: and so on
  cache[cacheId] = false;
  if (data.origin === 'null') return false;

  const host = data.hostname;

  if (exclude) {
    exclude = Array.isArray(exclude) ? exclude : [exclude];

    if (exclude && exclude.length) {
      for (const i of exclude) {
        cache[cacheId] = false;
        if (host === i) return false;
      }
    }
  }

  cache[cacheId] = true;
  if (host !== sitehost) return true;

  cache[cacheId] = false;
  return false;
}

module.exports = isExternalLink;
