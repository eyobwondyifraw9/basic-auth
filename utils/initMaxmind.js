const maxmind = require("maxmind");
const path = require("path");

const maxmindReader = null;

async function initMaxmindDB(){
    if(!maxmindReader){
        const dbPath = path.join(__dirname, '../data/GeoLite2-City.mmdb');
        maxmindReader = await maxmind.open(dbPath);
        console.log("✅ MaxMind GeoLite2 DB loaded");
    }
}

module.exports = {
    maxmindReader,
    initMaxmindDB
}