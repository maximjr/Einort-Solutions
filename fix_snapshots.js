import fs from 'fs';
import path from 'path';

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
       let content = fs.readFileSync(fullPath, 'utf8');
       let modified = false;
       
       // For Analytics.tsx
       if (content.includes('unsubLeads = onSnapshot(qLeads, async (snap) => {')) {
         content = content.replace(/unsubLeads = onSnapshot\(qLeads, async \(snap\) => \{([\s\S]*?)\}\);/g, 'unsubLeads = onSnapshot(qLeads, async (snap) => {$1}, (err) => console.warn(err));');
         modified = true;
       }
       
       // For Projects.tsx
       if (content.includes('unsubSandbox = onSnapshot(qSandbox, (snap) => {')) {
         content = content.replace(/unsubSandbox = onSnapshot\(qSandbox, \(snap\) => \{([\s\S]*?)\}\);/g, 'unsubSandbox = onSnapshot(qSandbox, (snap) => {$1}, (err) => console.warn(err));');
         modified = true;
       }
       if (content.includes('unsubCustom = onSnapshot(qCustom, (snap) => {')) {
         content = content.replace(/unsubCustom = onSnapshot\(qCustom, \(snap\) => \{([\s\S]*?)\}\);/g, 'unsubCustom = onSnapshot(qCustom, (snap) => {$1}, (err) => console.warn(err));');
         modified = true;
       }
       
       // For Users.tsx
       if (content.includes('const unsubscribe = onSnapshot(q, (snap) => {')) {
         content = content.replace(/const unsubscribe = onSnapshot\(q, \(snap\) => \{([\s\S]*?)\}\);/g, 'const unsubscribe = onSnapshot(q, (snap) => {$1}, (err) => console.warn(err));');
         modified = true;
       }
       
       // For Overview.tsx
       if (content.includes('const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {')) {
         content = content.replace(/onSnapshot\(collection\([^)]+\), \([^)]+\) => \{([\s\S]*?)\}\);/g, 'onSnapshot(collection(db, "unknown"), () => {}, (err) => console.warn(err));'); 
         // wait I can just use string replace backwards
       }
       
       // General replace
       if (content.includes('onSnapshot(')) {
          // This regex handles standard `unsub = onSnapshot(query, (snap) => { ... });`
          // Assuming it ends with `});`
          // It's safer to just replace all `});` that are part of onSnapshot.
       }
    }
  }
}
// too complex.
