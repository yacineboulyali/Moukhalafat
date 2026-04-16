const { Jimp } = require('jimp');

async function testJimp() {
  try {
    const img = await Jimp.read('c:/Users/Yacine/voyages-des-competences/assets/images/settings-avatar.png');
    img.resize({ w: 150 });
    console.log('Resize worked!');
  } catch (e) {
    console.error(e);
  }
}

testJimp();
