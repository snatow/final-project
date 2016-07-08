var pg = require('pg');
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";

var client = new pg.Client(db);
client.connect();

// console.log("in users")
var query = client.query("CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, username VARCHAR not null, email VARCHAR not null, password VARCHAR not null)");
query.on('end', function() { client.end();});
