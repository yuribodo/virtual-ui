#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Virtual UI CLI...');

try {
  // Clean dist folder
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
    console.log('✅ Cleaned dist folder');
  }

  // Build TypeScript
  execSync('tsc', { stdio: 'inherit' });
  console.log('✅ TypeScript compiled');

  // Make the main file executable
  const mainFile = path.join(__dirname, 'dist', 'index.js');
  if (fs.existsSync(mainFile)) {
    fs.chmodSync(mainFile, '755');
    console.log('✅ Made CLI executable');
  }

  // Copy package.json to dist for reference
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  fs.writeFileSync(
    path.join(__dirname, 'dist', 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  console.log('🎉 Build completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Test locally: npm link');
  console.log('2. Test CLI: virtual-ui --help');
  console.log('3. Publish: npm publish');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 