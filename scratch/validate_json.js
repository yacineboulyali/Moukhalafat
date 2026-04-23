const fs = require('fs');

try {
    const buffer = fs.readFileSync('c:\\Users\\Yacine\\Downloads\\Mission_R1_Complet.json');
    console.log("First 10 bytes (hex):", buffer.slice(0, 10).toString('hex'));
    const data = buffer.toString('utf8');
    JSON.parse(data);
    console.log("JSON is valid");
} catch (e) {
    console.log("JSON is invalid: " + e.message);
}
