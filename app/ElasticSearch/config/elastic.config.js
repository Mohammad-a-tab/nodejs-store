import { ELASTIC_USERNAME, ELASTIC_PASSWORD, ELASTIC_HOST } from process.env
import {Client} from "@elastic/elasticsearch"

const elasticSearch = new Client({
    node: ELASTIC_HOST,
    auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

export default elasticSearch
