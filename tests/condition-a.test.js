const test=require('node:test');const assert=require('node:assert/strict');
process.env.ALLOW_INDEXING='false';const {app}=require('../website/server-condition-a');let server,base;
test.before(async()=>{server=app.listen(0);await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}`});test.after(()=>server.close());
test('Condition A has asset pages without rich layers',async()=>{const html=await(await fetch(`${base}/assets/ui/notification/notification-01`)).text();assert.match(html,/Download OGG/);assert.match(html,/CC0 1.0/);assert.doesNotMatch(html,/application\/ld\+json|Measured from the audio|Intended game-development uses|Asset JSON/);});
test('Condition A has no agent API',async()=>assert.equal((await fetch(`${base}/api/search?q=notification`)).status,404));
test('prelaunch deployment blocks indexing',async()=>{assert.match(await(await fetch(`${base}/robots.txt`)).text(),/Disallow: \/$/m);assert.equal((await fetch(`${base}/sitemap.xml`)).status,404);});
