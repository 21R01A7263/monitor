import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve('./changed.json');

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { previousClass: null, hasChanged: false, changedAt: null };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data), 'utf8');
}

export default async function handler(req, res) {
  let data = loadData();

  if (data.hasChanged) {
    return res.status(200).json({ changed: true, changedAt: data.changedAt });
  }

  try {
    const response = await fetch('https://in.bookmyshow.com/cinemas/hyd/pvr-nexus-mall-kukatpally-hyderabad/buytickets/PVFS/20250723');
    const html = await response.text();
    const dom = new JSDOM(html);
    const div = dom.window.document.querySelector('div.sc-h5edv-0.cmkkZb');

    if (!div) return res.status(404).json({ error: 'Div not found' });

    const currentClass = div.className;
    if (data.previousClass === null) data.previousClass = currentClass;

    if (data.previousClass !== currentClass) {
      data.hasChanged = true;
      data.changedAt = new Date().toISOString();
      saveData(data);
      return res.status(200).json({ changed: true, changedAt: data.changedAt });
    }

    saveData(data);
    return res.status(200).json({ changed: false });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
