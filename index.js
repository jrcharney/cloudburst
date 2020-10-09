// @file cloudburst/index.js
// These theree aren't used in this module so we can ommit them.
const env           = require('dotenv').config();  	// Store oure APIKeys and tokens elsewhere
const fetch         = require('node-fetch'); 	// Node doesn't have 'fetch'. This should fix that!
//const NodeGeocoder  = require('node-geocoder'); 	// We need this to convert a location to latitude and longitude
const {argv} = require('yargs'); 	// Let's ues some command line input

//const express 		= require('express');
//const sass          = require('node-sass');
//const pug           = require('pug');
//sass.render({file: '/src/styles/styles.scss'}); 	// TODO: Decide where to put this file
const Weather             = require('./local/Weather');
const { getLocationByIP } = require('./local/GeoIP');


// TODO: HTML Mode!
// TODO: Moon Phases
// TODO: Help for command line.
// TODO: Allow the user to specify what language you would like to use. Right now `lang=en`
// TODO: Allow user to specify what units to use. If so, adjust program accoridnly. Options are 'standard', 'metric', and 'imperial' of which my program has 'imperial' as default.
//let units    = "imperial"; 		// now included as a default in Weather
// TODO: Allow the user to display the forecasts they want.
// 			Because it us used as an exclusion list, the parts that are in the `exclude` parameter will be ommitted.
// * current 	// current forecast
// * minutely 	// TOO LONG!
// * hourly 	// long!!! (exclude)
// * daily 		// daily forecast (use this later)
// * alerts 	// weather alerts (what we want!)
let part     = "minutely,hourly,daily"; 	// TODO: Set this part!
// TODO: JSON Mode (sorta default?) (These will likely be used in our ORM later.

function help(){
	let ayuda = [
		`CODEBURST part of LightniNG/Blitz\n`,
		`Command line weather powered by OpenWeatherMaps.\n`,
		`USAGE`,
		`\tnode index.js ["LOCATION"] [ARGS]\n`,
		`ARGUMENTS`,
		`\t--ip\t\t\t\tGet location by IP address`,
		`\t--json\t\t\tJSON output (useful for piping into another app)`,
		`\t--location="LOCATION"\t\tGet the current observation for a specific location using city and state or Zip Code`,
		`\t--country=CC\t\t\tGet the weather from a specific country. By default, this is in the United States (US)`,
		`\t--lang=LANG\t\t\tGet the weather in a specific language. By default, this is in English (en).`,
		`\t--units=UNITS\t\t\tReport the weather either in standard, metric, or imperial (default)`,
		`\t--show=[items]\t\t\tShow certain data`,
		`\t--hide[items]\t\t\tHide certain data that shows by default`,
		`\t\tcondtions\t\tHide the current weather condtions`,
		`\t\talerts\t\t\tHide any weather alerts`
	];
	console.log(ayuda.join('\n'));
	// TODO: exclude=""
}

(async () => {
//async function geostorm(location){
	try{
		// constructor(location,exclude="minutely,hourly,daily",units="imperial",lang="en",country="US")
		
		let location, units, lang, country;
		if(argv._length > 0){
			location = argv._[0];
		} else {
			location = await getLocationByIP();  // Note: Output is in JSON format!
		}

		//console.log(part);
		//console.log(Object.entries(argv));

		for(let [arg,val] of Object.entries(argv)){
			//console.log(`${arg}`);
			if(arg === "_"){
				//console.log(`${arg} : ${val.toString()}`);
				continue; // skip this one.
			}else if(arg.match(/^\$\d+$/g)){  // '$0' and others.
				//console.log(`${arg}`); // : ${val.toString()}`);
				continue; // skip these
			}else if(arg === "location"){
				location = argv.location || val;
			} else if(arg === "country"){
				// two letter country code
				country = argv.country || val || "US"; // us is default
			} else if(arg === "lang"){
				lang = argv.lang || val || "en"; 		// en is default
			} else if(arg === "units"){
				units = argv.units || val || "imperial"; 	// imperial is default
			} else if(arg === "ip"){
				// --ip is a boolean, but if you add a value ot it there is a string? 
				// TODO: How do I make this a default option?
				//console.log(typeof(val)); // if not set it is boolean, if set it is a string!
				location = await getLocationByIP();
			} else if(arg === "h"){ // we need to use -h since we can't use --help. Node has reserved that.
				help();
				process.exit(); // leave the program with this option
			} 
			/*
			else {
				// TODO: Probably should throw an error instead.
				//location = await getLocationByIP();
				throw `Invalid argument ${arg}. Use --help to see options.`;
			}
			*/
		}

		let wx = new Weather(location,part,units,lang,country); // TODO: Input as an object

		// These three functions are needed to get our data
		// TODO: See if we can consolidate them
		/*
		 * await wx.setGeoData();
		 * await wx.setWeather();
		 * await wx.setCurrentObservation();
		 */
		await wx.setData();

		//let res = []; // Let's put this together as an array then join it as a string later
		
		// I decided to keep these. They could be useful.
		//console.log(typeof(argv.show));
		
		// TODO: There's an API for bulk downloads. Look into that.

		let data = {
			/*
			input : {
				location       : async function(loc){return wx.setLocation(loc);},
				country        : async function(cc){return wx.setCountry(cc);}
			},
			*/
			show : {
				geodata        : async function(){return await wx.getGeoData();},
				location       : async function(){return await wx.getGeoLocation();},
				coords         : async function(){return await wx.getGeoCoordinates();},
				weather        : async function(){return await wx.getCurrent();}, 						// remove "current" from exclude
				raw_alerts     : async function(){return await wx.getAlerts();}, 						// remove "alerts" from exclude 
				raw_conditions : async function(){return await wx.getCurrentCondtions();}, 				// remove "current" from exclude
				// print the current weather observation
				conditions     : async function(){return await wx.getCurrentObservation();}, 			// remove "current" from exclude
				// print the current wether alerts, add true to show full messages
				alerts         : async function(full=false){return await wx.getCurrentAlerts(full);} // TODO: remove "current" from exclude
				// TODO: These featueres need functions!
				// * minutely 	// TOO LONG!
				// * hourly 	// long!!! (exclude)
				// * daily 		// daily forecast (use this later)
			},
			hide : {
				// print the current weather observation
				conditions     : async function(){return await wx.printCurrentObservation();}, 	// TODO: add "current" to exclude
				// print the current wether alerts, add true to show full messages
				alerts         : async function(full=false){return await wx.printCurrentAlerts(full);} 	// TODO: add "alerts" to exclude
			}
		};
		/*
		// TODO: Run the print functions
		wx.printCurrentObservation();
		wx.printCurrentAlerts(true);
		wx.printCurrentAlerts()
		*/

		/*
		if(argv.input){
			let list = argv.input.split(',');
			let keys = Object.keys(data.input);
			for(let item of list){
				if(keys.includes(item)){
					data.input[item] = value;
				}
			}
		}
		*/

		if(argv.show){
			let list = argv.show.split(',');
			let keys = Object.keys(data.show);
			for(let item of list){
				if(keys.includes(item)){
					//console.log(await data.show[item]());
					if(item === "alerts" && argv.full){
						console.log(await data.show[item](true));	
					}else{
						console.log(await data.show[item]());
					}
				}else{
					throw `${item} is not a showable option.`;
				}
			}
		}
		
		let keys = Object.keys(data.hide);
		if(argv.hide){
			if(argv.hide !== "all"){
				let list = argv.hide.split(',');
				for(let item of list){
					let pos = keys.indexOf(item);
					if(pos === -1){
						throw `${item} is not a hideable option.`;
					} else{
						keys.splice(pos,1);
					}
				}
			} else {
				keys = [];
			}
		}
		if(keys.length > 1){
			for(let item of keys){
				if(item === "alerts" && argv.full){
					await data.hide[item](true);	
				} else {
					await data.hide[item]();
				}
			}
		}
	}catch(err){
		console.error("ERROR: ", err);
	}

})();
//};

/*
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
	res.send();
}).listen(port);
*/
/*
app.listen(port, () => {
	console.log(`Example app listing at https://localhost:${port}`);
});
*/
