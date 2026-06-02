import fs from 'fs';
const envKeys = Object.keys(process.env).filter(k => k.includes('VITE_') || k.includes('FIREBASE'));
const envVals = envKeys.map(k => `${k}=${process.env[k]}`).join('\n');
console.log(envVals);
