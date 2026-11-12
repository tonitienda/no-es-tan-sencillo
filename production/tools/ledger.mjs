// Reads the episode's source ledger (research/01-source-ledger.md):
//   ### V9 - INE, Censo 2021, viviendas [P]
//   https://...
import {existsSync, readFileSync} from 'node:fs';

const ENTRY = /^###\s+(V\d+)\s*[-–—]\s*(.+?)\s*$/;
const LEVEL = /\s*\[([PSC](?:\s*[,y/]\s*[PSC])*)[^\]]*\]\s*$/;

export function parseLedger(markdown) {
  const entries = new Map();
  let current = null;
  for (const line of markdown.split(/\r?\n/)) {
    const m = line.match(ENTRY);
    if (m) {
      const level = m[2].match(LEVEL);
      current = {id: m[1], title: m[2].replace(LEVEL, '').trim(), level: level ? level[1].replace(/\s/g, '') : null, urls: []};
      entries.set(current.id, current);
      continue;
    }
    if (/^#{1,3}\s/.test(line)) { current = null; continue; }
    if (current) for (const u of line.matchAll(/https?:\/\/[^\s)>\]]+/g)) current.urls.push(u[0].replace(/[.,;]$/, ''));
  }
  return entries;
}

export function readLedger(file) {
  if (!existsSync(file)) throw Error(`Missing source ledger ${file}`);
  return parseLedger(readFileSync(file, 'utf8'));
}
