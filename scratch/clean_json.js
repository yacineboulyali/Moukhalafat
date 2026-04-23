const fs = require('fs');
const path = 'c:\\Users\\Yacine\\Downloads\\Mission_R1_Complet.json';

try {
    const data = fs.readFileSync(path, 'utf8');
    const json = JSON.parse(data);
    const cleaned = JSON.stringify(json, null, 2);
    fs.writeFileSync(path, cleaned, 'utf8');
    console.log("JSON cleaned and saved successfully");
} catch (e) {
    console.log("Error cleaning JSON: " + e.message);
}
