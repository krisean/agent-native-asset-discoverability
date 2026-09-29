const fs = require('node:fs');
const path = require('node:path');

const STOP = new Set(['a','an','and','for','i','in','is','it','my','of','on','the','to','when','with']);
const tokenize = value => [...new Set(String(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(token => token.length > 1 && !STOP.has(token)))];
const corpusPath = path.resolve(__dirname, '..', 'metadata', 'corpus.json');
const loadCorpus = () => JSON.parse(fs.readFileSync(corpusPath, 'utf8')).assets;

function scoreAsset(asset, query) {
  const terms = tokenize(query); if (!terms.length) return 0;
  const fields = [
    [asset.name, 5], [asset.subcategory, 5], [asset.category, 3], [asset.description, 3],
    [asset.use_cases.join(' '), 4], [asset.character.join(' '), 3], [asset.tags.join(' '), 2]
  ];
  let score = 0;
  for (const term of terms) for (const [text, weight] of fields) if (tokenize(text).some(token => token === term || token.startsWith(term) || term.startsWith(token))) score += weight;
  return +(score / (terms.length * 25)).toFixed(4);
}

function search(query, limit = 10) {
  return loadCorpus().map(asset => ({asset, relevance_score: scoreAsset(asset, query)}))
    .filter(result => result.relevance_score > 0).sort((a,b) => b.relevance_score-a.relevance_score || a.asset.id.localeCompare(b.asset.id)).slice(0, limit);
}
module.exports = { loadCorpus, scoreAsset, search, tokenize };
