const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

const root = path.resolve(__dirname, '..');
const sampleRate = 44100;
const seed = 19470523;
let randomState = seed;
const random = () => ((randomState = (1664525 * randomState + 1013904223) >>> 0) / 2 ** 32) * 2 - 1;

const categories = [
  ['ui', 'notification', 'Soft UI Notification', ['message received', 'quest update', 'mobile game notification'], ['soft', 'pleasant', 'clean'], 0.72, 'chime'],
  ['ui', 'button-click', 'UI Button Click', ['menu button', 'settings toggle', 'dialog confirmation'], ['short', 'clean', 'tactile'], 0.16, 'click'],
  ['ui', 'error', 'Subtle UI Error', ['invalid action', 'form validation', 'unavailable ability'], ['subtle', 'restrained', 'clear'], 0.38, 'error'],
  ['gameplay', 'item-pickup', 'Item Pickup', ['collectible pickup', 'inventory addition', 'coin collection'], ['satisfying', 'bright', 'compact'], 0.44, 'pickup'],
  ['gameplay', 'achievement', 'Achievement Unlock', ['achievement earned', 'milestone reached', 'reward reveal'], ['positive', 'celebratory', 'polished'], 1.05, 'fanfare'],
  ['gameplay', 'quest-complete', 'Quest Complete', ['RPG quest completion', 'objective complete', 'mission reward'], ['warm', 'rewarding', 'fantasy'], 1.28, 'quest'],
  ['combat', 'sword-impact', 'Fantasy Sword Impact', ['melee hit', 'sword clash', 'dark fantasy combat'], ['sharp', 'metallic', 'forceful'], 0.58, 'impact'],
  ['magic', 'spell-cast', 'Magic Spell Cast', ['wizard spell', 'magic ability', 'fantasy casting'], ['shimmering', 'mystical', 'energetic'], 0.92, 'spell'],
  ['movement', 'footstep', 'Adventure Footstep', ['player movement', 'stone path', 'dungeon walking'], ['grounded', 'dry', 'natural'], 0.31, 'step'],
  ['environment', 'ambient', 'Forest Night Ambience', ['game environment', 'forest level', 'quiet exploration'], ['calm', 'atmospheric', 'organic'], 4.0, 'ambient']
];

function ensure(directory) { fs.mkdirSync(directory, { recursive: true }); }
function envelope(t, duration, attack = 0.01, decay = 3) {
  return Math.min(1, t / attack) * Math.exp(-decay * t / duration) * Math.min(1, (duration - t) / 0.02);
}
function synth(kind, duration, variant) {
  const count = Math.round(duration * sampleRate);
  const samples = new Float64Array(count);
  const base = [0, 37, -29][variant];
  let lastNoise = 0;
  for (let i = 0; i < count; i++) {
    const t = i / sampleRate;
    const e = envelope(t, duration);
    const noise = random();
    lastNoise = 0.82 * lastNoise + 0.18 * noise;
    let value = 0;
    if (kind === 'chime') value = (Math.sin(2*Math.PI*(660+base)*t) + .45*Math.sin(2*Math.PI*(990+base)*t)) * e;
    if (kind === 'click') value = (noise*.65 + Math.sin(2*Math.PI*(1300+base*4)*t)*.35) * Math.exp(-38*t);
    if (kind === 'error') value = Math.sin(2*Math.PI*(230+base)*t) * (.65+.35*Math.sin(2*Math.PI*7*t)) * e;
    if (kind === 'pickup') value = Math.sin(2*Math.PI*(520+base+900*t)*t) * e;
    if (kind === 'fanfare') value = [.0,.26,.53].reduce((s,o,j) => s + .33*Math.sin(2*Math.PI*(523+base)*(1+o)*t)*(t>j*.12), 0) * e;
    if (kind === 'quest') value = (Math.sin(2*Math.PI*(392+base)*t)+.55*Math.sin(2*Math.PI*(523+base)*t)+.3*Math.sin(2*Math.PI*(659+base)*t))*e;
    if (kind === 'impact') value = (noise*.7 + Math.sin(2*Math.PI*(1700+base*5)*t)*.35) * Math.exp(-10*t);
    if (kind === 'spell') value = (lastNoise*.4 + Math.sin(2*Math.PI*(300+base+1600*t)*t)*.65) * e;
    if (kind === 'step') value = (lastNoise*.8 + Math.sin(2*Math.PI*(95+base)*t)*.4) * Math.exp(-18*t);
    if (kind === 'ambient') value = (lastNoise*.45 + .08*Math.sin(2*Math.PI*(1800+base)*t)*(Math.sin(2*Math.PI*.37*t)>.96)) * envelope(t,duration,.6,.5);
    samples[i] = Math.max(-1, Math.min(1, value * [0.38, 0.45, 0.34][variant]));
  }
  return samples;
}
function wavBuffer(samples) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(buffer.length - 8, 4); buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34); buffer.write('data', 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((sample, i) => buffer.writeInt16LE(Math.round(sample * 32767), 44 + i * 2));
  return buffer;
}
function derived(samples) {
  let sumSq = 0, peak = 0, crossings = 0, transient = 0, previous = 0, previousEnergy = 0;
  for (let i=0; i<samples.length; i++) {
    const x=samples[i]; sumSq += x*x; peak=Math.max(peak,Math.abs(x));
    if (i && Math.sign(x)!==Math.sign(previous)) crossings++;
    const energy=x*x; if (energy-previousEnergy>.035) transient++; previousEnergy=.95*previousEnergy+.05*energy; previous=x;
  }
  const rms=Math.sqrt(sumSq/samples.length); const centroid=estimateCentroid(samples);
  return {
    duration_seconds: +(samples.length/sampleRate).toFixed(3), sample_rate_hz: sampleRate, bit_depth: 16,
    channels: 1, channel_configuration: 'mono', peak_dbfs: +(20*Math.log10(peak||1e-9)).toFixed(2),
    rms_dbfs: +(20*Math.log10(rms||1e-9)).toFixed(2), loudness_lufs_estimate: +(20*Math.log10(rms||1e-9)-0.7).toFixed(2),
    zero_crossing_rate: +(crossings/samples.length).toFixed(5), spectral_centroid_hz: Math.round(centroid),
    spectral_rolloff_hz: Math.round(centroid*1.85), transient_density_per_second: +(transient/(samples.length/sampleRate)).toFixed(2),
    estimated_brightness: centroid>1800?'bright':centroid>700?'balanced':'dark', dynamic_range_db: +(20*Math.log10((peak||1e-9)/(rms||1e-9))).toFixed(2)
  };
}
function estimateCentroid(samples) {
  const n=2048, stride=Math.max(1,Math.floor(samples.length/n)); let weighted=0,total=0;
  for(let k=1;k<n/2;k+=4){let re=0,im=0;for(let j=0;j<n;j++){const x=samples[Math.min(samples.length-1,j*stride)];const a=2*Math.PI*k*j/n;re+=x*Math.cos(a);im-=x*Math.sin(a);}const m=Math.hypot(re,im);weighted+=k*sampleRate/n*m;total+=m;}
  return total?weighted/total:0;
}

const records=[];
for (const [category, subcategory, title, useCases, character, duration, kind] of categories) {
  for (let variant=0; variant<3; variant++) {
    const index=String(variant+1).padStart(2,'0');
    const slug=`${subcategory}-${index}`; const id=`${category}-${subcategory}-${index}`;
    const samples=synth(kind,duration+variant*.06,variant); const metrics=derived(samples);
    const directory=path.join(root,'assets',category,subcategory); ensure(directory);
    const wav=`${slug}.wav`, ogg=`${slug}.ogg`; fs.writeFileSync(path.join(directory,wav),wavBuffer(samples));
    const conversion=spawnSync(ffmpegPath,['-y','-loglevel','error','-i',path.join(directory,wav),'-c:a','libvorbis','-q:a','5',path.join(directory,ogg)]);
    if(conversion.status!==0) throw new Error(conversion.stderr.toString());
    records.push({
      schema_version:'1.0.0', id, slug, name:`${title} ${index}`, type:'sound_effect', category, subcategory,
      description:`A ${character.join(', ')} ${title.toLowerCase()} designed for ${useCases.join(', ')}. Variation ${index} has audibly distinct timing and tone.`,
      use_cases:useCases, character, mood:character.slice(0,2), context:'game development', intended_application:['video games','interactive UI'],
      editorial:{loopable:kind==='ambient', pitch_description:kind==='impact'||kind==='step'?'unpitched/percussive':'tonal'},
      derived:{...metrics, loopability_estimate:kind==='ambient'?'possible with crossfade':'not loopable', extraction:{pipeline:'scripts/generate-corpus.js',algorithm_version:'1.0.0',source:'decoded PCM WAV master'}},
      files:{wav:`/media/${category}/${subcategory}/${wav}`,ogg:`/media/${category}/${subcategory}/${ogg}`},
      license:{spdx:'CC0-1.0',name:'CC0 1.0 Universal',url:'https://creativecommons.org/publicdomain/zero/1.0/',commercial_use:true,attribution_required:false},
      provenance:{generator:'Deterministic procedural synthesis',seed,generated_at:'2026-09-29T00:00:00Z',source_recording:false},
      canonical_path:`/assets/${category}/${subcategory}/${slug}`, tags:[category,subcategory,'game audio','sound effect',...character,...useCases]
    });
  }
}
ensure(path.join(root,'metadata','assets'));
for(const record of records) fs.writeFileSync(path.join(root,'metadata','assets',`${record.id}.json`),JSON.stringify(record,null,2)+'\n');
fs.writeFileSync(path.join(root,'metadata','corpus.json'),JSON.stringify({schema_version:'1.0.0',generated_at:'2026-09-29T00:00:00Z',asset_count:records.length,assets:records},null,2)+'\n');
console.log(`Generated ${records.length} distinct assets (${records.length*2} audio files).`);
