const publicIp = require("public-ip");
const config = require("../config.json");
const fetch = require("node-fetch");

let data = require("./request-data.json");
let currentIP = "";
const zone_id = config.cloudflare_zone_id;
const record_id = config.cloudflare_dns_record_id;
let url = `https://api.cloudflare.com/client/v4/zones/${zone_id}/dns_records/${record_id}`;

const updateRecord = () => {
	console.log("updating ip to " + currentIP);
	data.content = currentIP;
	return fetch(url, {
		method: "PUT",
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json",
			"X-Auth-Email": config.cloudflare_email,
			"X-Auth-Key": config.cloudflare_api_key
		},
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	}).then(response => response.json()); // parses JSON response into native Javascript objects
}

setInterval(async () => {
	publicIP = await publicIp.v4();
	if (currentIP != publicIP) {
		currentIP = publicIP;
		updateRecord().then(response => console.log(response));
	}
}, 10000);
