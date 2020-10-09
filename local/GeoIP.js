// @file local/GeoIP.js
const env = require('dotenv').config();
const fetch = require('node-fetch');
// We're going to have to run this in index since we can't put this function in Location.js.
// NOTE: This can't be in a class and defintily not a constructor.
/* `json` returns { ip : '{{currnet IP address}}', 
 *           hostname: '{{hostname}}',
 *           city: '{{city}}',
 *           region: '{{state}}',
 *           country: '{{CC}}',
 *           loc: '{{lat}},{{lon}}',
 *           org: '{{ASN}} {{ISP}}',
 *           postal: '{{zipcode}}', 		// This is a little off, so it would probably be better to use city and region
 *           timezone: '{{Time/Zone}}',
 *           readme: 'https://ipinfo.io/missingauth'   // This appears if you don't use a token! So get one!
 *         }
 */
// To use IP location, you MUST get a token through IpInfo.io, otherwise you'll get a missingauth, and I think they might cut you off.
// TODO: Hopefully this looks up the USER's IP address not the SERVER's IP address. (By server, I mean the computer this program runs on.)
async function getLocationByIP(){
	try {
		const url  = "https://ipinfo.io/?token=" + process.env.IPINFO_TOKEN;
		const res  = await fetch(url);
		const json = await res.json();
		return  `${json.city}, ${json.region}`;
	} catch(err) { console.error(err); }
}

module.exports = { getLocationByIP };

