const Jimp = require('jimp');

async function removeWhiteBackground() {
  const imageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX02xVm_1ZbEHldthvtfyk9kUvrQ7kJWEKKk97q7NNECvo4OYKAHpwZ2l-DlvuMB3FN_ifc4BrXJpjFVuoX3al4uIU4qAx26Qsyzx-wSKFaDwbo2XTgkySsffXUeRQQIbSAil8_diMshNVvTaCw4gItFnxapZ4xcowAq8SU8Fp5YMMksFFp29ESMBlqlfKbogLdWLd88IPnc0V6iQkzUeh-7ef_HCrFnXWdqsW6qYsCj5mEL2xUcall-TiugdcLTONkicSEAyMtHU';
  try {
    const image = await Jimp.read(imageUrl);
    // tolerance
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      if (red > 240 && green > 240 && blue > 240) {
        this.bitmap.data[idx + 3] = 0;
      }
    });
    // save
    await image.writeAsync('./assets/images/ben-ali-family-transparent.png');
    console.log('Background removed successfully.');
  } catch (err) {
    console.error('Error reading image:', err);
  }
}
removeWhiteBackground();
