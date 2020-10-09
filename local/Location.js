// @file local/Weather.js
// Where all our Geolocation functoosn go.
const env      = require('dotenv').config(); 
const fetch    = require('node-fetch');
const geocoder = require('node-geocoder');

/*
const { getLocationByIP } = require('./GeoIP');

async function glbip(){ return await getLocationByIP(); }
console.log(glbip());
*/

// This will be a super class of Weather
// I added a couple static functions so I could use them in the constructor.
class Location {
	constructor(location,countryCode="US"){
		this.location    = location;
		this.countryCode = countryCode;
		this.geocoder    = geocoder({provider : "openstreetmap"});  // NodeGeocoder - This will smartly find our location
		this.geo  		 = [];  // An array that will store the data fetched from geocoder
	}

	setCountry(countryCode){
		this.countryCode = countryCode;
		return this;
	}

	getCountry(){ return this.countryCode;}

	setLocation(location){
		this.location = location.toString();
		return this;
	}

	getLocation(){ return this.location; }

	// TODO: We're going to have to do what we can to conserve requests.
	// We have some asynchronous data, so there will be some async/await going on.
	// Note: Adding async makes a function into a promise generator.
	async setGeoData(){
		try{
			let gc = await this.geocoder.geocode(this.location); 		// returns a promise (so yeah, we need to be async)
			if(gc.length < 1){
				throw new Error(`We could not find ${this.location}`);
			}
			// countryCode will filter the results. (No more weather from outside the country, unless we ask for it!)
			gc = gc.filter((place) => place.countryCode === this.countryCode);
			//console.log(gc);  
			if(gc.length < 1){
				throw new Error(`We could not find ${this.location} in ${this.countryCode}`);
			}

			// Put in in our geo array
			this.geo["city"]  = gc[0]["city"];
			this.geo["state"] = gc[0]["state"];
			this.geo["zip"]   = gc[0]["zipcode"];
			this.geo["cc"]    = gc[0]["countryCode"];
			// Geocoordinates
			this.geo["lat"]   = gc[0]["latitude"];
			this.geo["lon"]   = gc[0]["longitude"];
			// If zipcode is undefined, show country code as part of location
			this.geo["loc"]   = `${this.geo.city}, ${this.geo.state}${(this.geo.zip) ? " (" + this.geo.zip + ")" : ", " + this.geo.cc}`;
			return this;
		} catch(err) {
			return err;
		}
		//finally {
		//	return this.geo; // regardless if the geocoder finds anything, return this.geo;
		//}
	}
	
	// TODO: Do these need to be async?
	async getGeoData(){return this.geo;} 									// returns an object
	async getGeoLocation(){return this.geo.loc;} 							// returns a string
	async getGeoCoordinates(){return [ this.geo.lat, this.geo.lon ];} 		// returns an array
}

module.exports = Location;
