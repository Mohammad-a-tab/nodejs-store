const { ELASTIC_USERNAME, ELASTIC_PASSWORD, ELASTIC_HOST } = process.env;
const { Client } = require("@elastic/elasticsearch")

const elasticClient = new Client({
    node: ELASTIC_HOST,
    auth: {
        username : ELASTIC_USERNAME,
        password : ELASTIC_PASSWORD 
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {elasticClient}
