import fs from 'fs';
import path from 'path';

const cities = [
  { name: 'rabat', htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzdjNGRmNjdkZDQ1YTRkOTRiMjk5MmUzMDFhZjM4N2E1EgsSBxDNnqHm4QIYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUzMjg2MTU1MzU4NDMyOTY2&filename=&opi=89354086' },
  { name: 'chefchaouen', htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzUzNTUxNGY0MjhjMDQ1NjU5YzA5OGYxMzk5Y2YyMmIyEgsSBxDNnqHm4QIYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUzMjg2MTU1MzU4NDMyOTY2&filename=&opi=89354086' },
  { name: 'fes', htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY0ZTlmNjFiNGU2ODkwNDVhZDVlYmJjMWVhYzc4EgsSBxDNnqHm4QIYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUzMjg2MTU1MzU4NDMyOTY2&filename=&opi=89354086' },
  { name: 'marrakech', htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzc2OTdlMTdiYzJmNDQ1ZDFhYTU1MTUwZjVlNTkwZGRlEgsSBxDNnqHm4QIYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUzMjg2MTU1MzU4NDMyOTY2&filename=&opi=89354086' },
  { name: 'laayoune', htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2JkZDAyNmY3NzQyZTQ5NWZiYzE2YjcxYmMyMzYyZWFhEgsSBxDNnqHm4QIYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUzMjg2MTU1MzU4NDMyOTY2&filename=&opi=89354086' },
  { name: 'dakhla', htmlUrl: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAxN2U3ODBiYTMwZjRhOWViMzZmZWI0OWEwYWMzMTQ3EgsSBxDNnqHm4QIYAZIBIwoKcHJvamVjdF9pZBIVQhM4MzUzMjg2MTU1MzU4NDMyOTY2&filename=&opi=89354086' }
];

async function run() {
  const result = {};
  for (const city of cities) {
    try {
      console.log(`Processing ${city.name}...`);
      const resp = await fetch(city.htmlUrl);
      const html = await resp.text();
      
      // Extract image URL more generally
      const imgMatch = html.match(/<img[^>]+src=["'](https:\/\/lh3\.googleusercontent\.com[^"']+)["']/i);
      const imgUrl = imgMatch ? imgMatch[1] : null;

      // Extract city title
      const cityTitleMatch = html.match(/<span class="font-headline font-bold[^>]*>([^<]+)<\/span>/);
      const cityTitle = cityTitleMatch ? cityTitleMatch[1].trim() : '';

      // Extract headline
      const headlineMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
      const headline = headlineMatch ? headlineMatch[1].trim() : '';

      // Extract description
      const descMatch = html.match(/<p class="text-on-surface-variant[^>]*>([\s\S]*?)<\/p>/);
      const desc = descMatch ? descMatch[1].trim() : '';
      
      // Extract focus
      const focusMatch = html.match(/Focus:\s*([^<]+)<\/div>/i);
      const focus = focusMatch ? focusMatch[1].trim() : '';

      result[city.name] = { imgUrl, cityTitle, headline, desc, focus };
      
      // Download Image
      if (imgUrl) {
         console.log(`Downloading image for ${city.name} from ${imgUrl.substring(0, 50)}...`);
         const imgResp = await fetch(imgUrl);
         const buffer = await imgResp.arrayBuffer();
         const targetPath = path.join(process.cwd(), 'assets', 'images', `intro-${city.name}.png`);
         fs.writeFileSync(targetPath, Buffer.from(buffer));
      }
    } catch (e) {
      console.error(`Error for ${city.name}:`, e);
    }
  }
  
  fs.writeFileSync('cities_data.json', JSON.stringify(result, null, 2));
  console.log('Done.');
}

run();
