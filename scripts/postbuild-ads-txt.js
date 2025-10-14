import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
const path = '.vercel/output/static/ads.txt';
const dir = dirname(path);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
const pub = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.replace('ca-pub-','') || '0000000000000000';
writeFileSync(path, `google.com, pub-${pub}, DIRECT, f08c47fec0942fa0\n`, 'utf8');
console.log('[postbuild] ads.txt written with pub id:', pub);
