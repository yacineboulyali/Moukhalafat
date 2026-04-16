const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const assetsDir = path.join(__dirname, '../assets/images');
const thumbnailsDir = path.join(__dirname, '../assets/thumbnails');

const protectedFiles = [
  'favicon.png',
  'icon.png',
  'splash-icon.png',
  'adaptive-icon.png',
  'android-icon-foreground.png',
  'android-icon-background.png',
  'android-icon-monochrome.png'
];

if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

async function processImage(filePath, fileName) {
  if (protectedFiles.includes(fileName)) {
    console.log(`Skipping protected file: ${fileName}`);
    return;
  }

  if (!/\.(png|jpe?g)$/i.test(fileName)) {
    return;
  }

  try {
    const minSizeForCompression = 100 * 1024; // 100kb
    const stats = fs.statSync(filePath);
    
    // Create Thumbnail
    console.log(`Creating thumbnail for ${fileName}...`);
    const thumbImg = await Jimp.read(filePath);
    thumbImg.resize({ w: 150 });
    
    const thumbName = path.parse(fileName).name + '-thumb.jpg';
    const thumbPath = path.join(thumbnailsDir, thumbName);
    await thumbImg.write(thumbPath);

    // Optimize Original if it's large
    if (stats.size > minSizeForCompression) {
      console.log(`Optimizing original ${fileName} (was ${Math.round(stats.size/1024)}KB)...`);
      
      const MAX_WIDTH = 1080;
      let img = await Jimp.read(filePath);
      if (img.bitmap.width > MAX_WIDTH) {
        img.resize({ w: MAX_WIDTH });
        await img.write(filePath);
        
        const newStats = fs.statSync(filePath);
        console.log(`-> Reduced ${fileName} to ${Math.round(newStats.size/1024)}KB`);
      } else {
         console.log(`Original ${fileName} is already under 1080px width, skipping logic.`);
      }
    } else {
      console.log(`Original ${fileName} is already small (${Math.round(stats.size/1024)}KB), skipping in-place compression.`);
    }

  } catch (err) {
    console.error(`Failed to process ${fileName}:`, err.message);
  }
}

async function run() {
  console.log('--- Starting Image Optimization & Thumbnail Generation ---');
  const files = fs.readdirSync(assetsDir);

  for (const file of files) {
    const fullPath = path.join(assetsDir, file);
    if (!fs.statSync(fullPath).isDirectory()) {
      await processImage(fullPath, file);
    }
  }

  console.log('--- Done! Check /assets/thumbnails/ ---');
}

run();
