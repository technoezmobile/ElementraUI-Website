import fs from "fs";

async function verify50AwesomeHttp() {
  const cat = JSON.parse(fs.readFileSync('public/data/awesome-catalogue.json', 'utf8'));
  const total = cat.length;
  console.log(`Total catalogue items: ${total}`);

  // 50 indices across beginning (0-16), middle (3000-3016), and end (6574-6590)
  const indices = [];
  for (let i = 0; i < 17; i++) indices.push(i);
  for (let i = 3280; i < 3297; i++) indices.push(i);
  for (let i = total - 17; i < total; i++) indices.push(i);

  console.log(`Testing ${indices.length} items over HTTP...`);
  let htmlOk = 0;
  let imgOk = 0;
  let emptyHtml = 0;
  let emptyImg = 0;

  for (const idx of indices) {
    const item = cat[idx];
    const htmlUrl = `http://localhost:5173${item.awesomeData.htmlUrl}`;
    const imgUrl = `http://localhost:5173${item.awesomeData.screenshotUrl}`;

    try {
      const resHtml = await fetch(htmlUrl);
      const text = await resHtml.text();
      if (resHtml.status === 200) {
        if (text.length > 0) htmlOk++;
        else emptyHtml++;
      }
    } catch (e) {
      console.error(`Failed HTML fetch for ${item.name} (${idx}):`, e.message);
    }

    try {
      const resImg = await fetch(imgUrl);
      const buf = await resImg.arrayBuffer();
      if (resImg.status === 200) {
        if (buf.byteLength > 0) imgOk++;
        else emptyImg++;
      }
    } catch (e) {
      console.error(`Failed Img fetch for ${item.name} (${idx}):`, e.message);
    }
  }

  console.log(`Results across ${indices.length} items:`);
  console.log(`  HTML 200 non-empty: ${htmlOk}`);
  console.log(`  HTML 200 empty: ${emptyHtml}`);
  console.log(`  Screenshot 200 non-empty: ${imgOk}`);
  console.log(`  Screenshot 200 empty: ${emptyImg}`);
}

verify50AwesomeHttp().catch(console.error);
