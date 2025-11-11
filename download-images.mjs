
import fs from 'fs';
import path from 'path';
import https from 'https';

const dinosaurs = JSON.parse(fs.readFileSync(path.resolve('./assets/dinosaurs.json'), 'utf-8'));

console.log('Attempting to find direct image links...');

async function getImageUrl(dinoName) {
  // First, search for a relevant file
  const searchApiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(dinoName)}&srnamespace=6&format=json&srlimit=1`;

  return new Promise((resolve) => {
    https.get(searchApiUrl, { headers: { 'User-Agent': 'DinoGuessr-Image-Downloader/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const searchData = JSON.parse(data);
          if (searchData.query && searchData.query.search.length > 0) {
            const pageTitle = searchData.query.search[0].title;
            
            // Now, get the image URL from the file title
            const imageInfoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=imageinfo&iiprop=url&format=json`;
            
            https.get(imageInfoUrl, { headers: { 'User-Agent': 'DinoGuessr-Image-Downloader/1.0' } }, (res2) => {
              let data2 = '';
              res2.on('data', (chunk) => { data2 += chunk; });
              res2.on('end', () => {
                try {
                  const imageData = JSON.parse(data2);
                  const pages = imageData.query.pages;
                  const pageId = Object.keys(pages)[0];
                  if (pages[pageId].imageinfo && pages[pageId].imageinfo.length > 0) {
                    resolve(pages[pageId].imageinfo[0].url);
                  } else {
                    resolve(null);
                  }
                } catch (e) {
                  resolve(null);
                }
              });
            }).on('error', () => resolve(null));
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function processDinosaurs() {
    for (const dino of dinosaurs) {
        const imageUrl = await getImageUrl(dino.name);
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(dino.name)}+dinosaur&tbm=isch&tbs=il:cl`;
        
        console.log(`
- Dinosaur: ${dino.name}`);
        console.log(`  Filename: ${dino.name}.jpg`);

        if (imageUrl) {
            const curlCommand = `curl "${imageUrl}" -o "assets/${dino.name}.jpg"`;
            console.log(`  Direct Image URL: ${imageUrl}`);
            console.log(`  Download Command: ${curlCommand}`);
        } else {
            console.log(`  Could not automatically find an image. Please find one manually.`);
            console.log(`  Search URL: ${searchUrl}`);
        }
    }
}

processDinosaurs();
