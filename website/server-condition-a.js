const express=require('express');
const path=require('node:path');
const {loadCorpus}=require('../lib/search');
const app=express();
const port=Number(process.env.PORT||3000);
const origin=(process.env.PUBLIC_ORIGIN||`http://localhost:${port}`).replace(/\/$/,'');
const allowIndexing=process.env.ALLOW_INDEXING==='true';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=value=>`${origin}${value}`;
const assets=()=>loadCorpus();
app.disable('x-powered-by');
app.use('/static',express.static(path.join(__dirname),{maxAge:'1h'}));
app.use('/media',express.static(path.resolve(__dirname,'..','assets'),{immutable:true,maxAge:'1y'}));
function layout(title,body,canonicalPath='/'){return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><link rel="canonical" href="${url(canonicalPath)}"><link rel="stylesheet" href="/static/styles.css"></head><body><header><strong><a href="/">PlayNow Sound Effects</a></strong><nav><a href="/categories">Categories</a><a href="/license">License</a></nav></header><main>${body}</main><footer><p>A small collection of game sound effects.</p></footer></body></html>`}
function card(asset){return `<article class="card"><h2><a href="${asset.canonical_path}">${esc(asset.name)}</a></h2><audio controls preload="none" src="${asset.files.ogg}"><a href="${asset.files.ogg}">OGG preview</a></audio></article>`}
app.get('/',(req,res)=>{const list=assets();res.send(layout('PlayNow Game Sound Effects',`<section class="hero"><h1>Game sound effects</h1><p>Browse ${list.length} downloadable sounds for games.</p></section><section class="grid">${list.map(card).join('')}</section>`));});
app.get('/categories',(req,res)=>{const groups=Object.groupBy(assets(),asset=>asset.category);res.send(layout('Sound-effect categories',`<h1>Categories</h1><section class="grid">${Object.entries(groups).map(([name,list])=>`<article class="card"><h2><a href="/categories/${name}">${esc(name)}</a></h2><p>${list.length} sounds</p></article>`).join('')}</section>`,'/categories'));});
app.get('/categories/:category',(req,res)=>{const list=assets().filter(asset=>asset.category===req.params.category);if(!list.length)return res.status(404).send('Unknown category');res.send(layout(`${req.params.category} sound effects`,`<h1>${esc(req.params.category)} sound effects</h1><section class="grid">${list.map(card).join('')}</section>`,req.path));});
app.get('/assets/:category/:subcategory/:slug',(req,res)=>{const asset=assets().find(item=>item.category===req.params.category&&item.subcategory===req.params.subcategory&&item.slug===req.params.slug);if(!asset)return res.status(404).send('Unknown asset');res.send(layout(asset.name,`<article><p><a href="/categories/${asset.category}">${esc(asset.category)}</a></p><h1>${esc(asset.name)}</h1><audio controls preload="metadata" src="${asset.files.ogg}"><a href="${asset.files.ogg}">OGG preview</a></audio><p><a href="${asset.files.ogg}" download>Download OGG</a> · <a href="${asset.files.wav}" download>Download WAV</a></p><p>License: <a href="/license">CC0 1.0</a></p></article>`,asset.canonical_path));});
app.get('/license',(req,res)=>res.send(layout('Asset license','<h1>License</h1><p>These sound effects are available under CC0 1.0 Universal.</p><p><a href="https://creativecommons.org/publicdomain/zero/1.0/">Read the license</a></p>','/license')));
app.get('/915d5c319cee515764d4b0f11f90ca6a.txt',(req,res)=>res.type('text/plain').send('915d5c319cee515764d4b0f11f90ca6a\n'));
app.get('/robots.txt',(req,res)=>res.type('text/plain').send(allowIndexing?`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n'));
app.get('/sitemap.xml',(req,res)=>{if(!allowIndexing)return res.status(404).send('Not available before indexing begins');const paths=['/','/categories','/license',...new Set(assets().map(asset=>`/categories/${asset.category}`)),...assets().map(asset=>asset.canonical_path)];res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(item=>`<url><loc>${url(item)}</loc></url>`).join('')}</urlset>`);});
app.use([/^\/api(?:\/|$)/,'/api-docs','/openapi.json'],(req,res)=>res.status(404).send('Not available in this experimental condition'));
if(require.main===module)app.listen(port,()=>console.log(`Condition A library listening on ${origin}; indexing ${allowIndexing?'enabled':'disabled'}`));
module.exports={app,origin,allowIndexing};
