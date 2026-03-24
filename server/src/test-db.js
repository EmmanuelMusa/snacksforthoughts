const { Client } = require('pg');

const internalUrl = "postgresql://admin:Nr8qRhxOph2KpblfHByccluv6ExubBng@dpg-d6iplijh46gs73f2ng80-a.frankfurt-postgres.render.com/snacksforthoughts_db?sslmode=require";
const externalUrl = "postgresql://admin:Nr8qRhxOph2KpblfHByccluv6ExubBng@dpg-d6iplijh46gs73f2ng80.frankfurt-postgres.render.com/snacksforthoughts_db?sslmode=require";

async function testConnection(url, name) {
    console.log(`Testing ${name}...`);
    const client = new Client({ connectionString: url, connectionTimeoutMillis: 5000 });
    try {
        await client.connect();
        console.log(`✅ ${name} Connected!`);
        await client.end();
        return true;
    } catch (err) {
        console.log(`❌ ${name} Failed: ${err.message}`);
        return false;
    }
}

async function start() {
    const internalOk = await testConnection(internalUrl, "Internal URL");
    const externalOk = await testConnection(externalUrl, "External URL");
    
    if (externalOk) {
        console.log("\nSUGGESTION: Use External URL (remove -a from hostname)");
    }
}

start();
