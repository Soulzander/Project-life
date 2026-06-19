const sharp = require('sharp');

Promise.all([
  sharp('public/logo.svg')
    .resize(192, 192)
    .png()
    .toFile('public/logo192.png'),
  sharp('public/logo.svg')
    .resize(512, 512)
    .png()
    .toFile('public/logo512.png')
]).then(() => {
  console.log('PNGs created successfully');
}).catch(err => {
  console.error('Error creating PNGs:', err);
});
