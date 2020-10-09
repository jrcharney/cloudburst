// @file local/Weather.js
const env      = require('dotenv').config(); 
const fetch    = require('node-fetch');
const geocoder = require('node-geocoder');

// SyntaxError: Cannot use import statement outside a module.
/*
import DateTime from './DateTime';
import { pad0, slice } from './Format';
import { tempF, percent, inHg } from './wx_format'
*/

const Location = require('./Location');
const DateTime = require('./DateTime');
//const { pad0, slice } = require('./Format');
const { tempF, percent, mbar, inHg, wind_dir, wind_mph, wind_beaufort, precip_in, dist_mi } = require('./wx_format');

// TODO: Use SAME codes to color code our output.

/*
let options = {
	location
	exclude
	units
	lang
	country
}
*/

class Weather extends Location {
	constructor(location,exclude="minutely,hourly,daily",units="imperial",lang="en",country="US"){
		super(location,country);
		this.owm_apiKey = process.env.OPENWEATHER_API; 			// we need an API key for this to work
		// The exclude varable tells us what part of the data NOT to fetch from OWM
		// * current  = omit the current weather report (we don't want to use this)
		// * daily    = omit the daily weather forecast (we should create a function for this, but for now it is being omitted)
		// * hourly   = omit the hourly weather forecast (this one is longer that the daily, we should make a function for this later)
		// * minutely = omit the minutely weathe forecase (this one is VERY LONG, and probably not that useful. Eventually make a function for this.)
		// * alerts   = omit the weather alerts, we DEFINTELY want to keep this from being omitted)
		this.exclude  = exclude;
		// units has three values: standard, metric, and imperial. Since we're in America, we are using imperial.
		this.units    = units;
		this.lang     = lang; 			// Language (English ("en") is default)

		// We should probably put the requests in the constructor

		this.wx   = {};  // An object that should contain weather information

		//this.wx   = {};  // The data fetched from OWM
		//this.wx_conditions = [];
		//this.wx_alerts = [];
		// TODO: We'll need variables for the forecasts later
		this.report = {};  // TODO: Could I use a Map?
	}
	
	// if this.exclude does not contain a part, return true.
	has(part){
		if(part.indexOf(',') > -1){
			return part.split(',').some(item => this.has(item));
		}else{
			// Find one item
			return !this.exclude.split(',').includes(part);
		}
	}

	async setData(){
		// I don't think we can chain await functions.
		await this.setGeoData();
		await this.setWeather();
		await this.setCurrentObservation();
		return this;
	}

	async setWeather(){
		// if(!exclude.split(',').includes("current"))
		// if(!exclude.split(',').includes("alerts"))
		const api   = 'https://api.openweathermap.org/data/2.5/onecall'; // One Call API
		//if(this.has("current,alerts")){}
		const query = {
			lat     : this.geo.lat,
			lon     : this.geo.lon,
			exclude : this.exclude,
			units   : this.units,
			lang    : this.lang,
			appid   : this.owm_apiKey
		};
		const qs  = Object.entries(query).map(([k,v]) => `${k}=${v}`).join('&');  // Convert our query object into a string
		const res = await fetch(`${api}?${qs}`);  	// Get the request
		this.wx   = await res.json();  				// return the data in JSON format. This MUST have an await!
		//this.wx   = await fetch(`${api}?${qs}`).json(); // NOPE! Can't do this
		return this;
	}
	// Make a call tho the OWM API
	// Shows the weather object
	async getWeather(){return this.wx;}

	// Get the current weather
	async getCurrent(){
		return this.wx.current;
	} 	// returns an object
	
	async getAlerts(){
		return this.wx.alerts;
	}  		// returns an array

	// The the weather object that is in the current observation. Return as a string
	async getCurrentConditions(){
		let conditions;
		if(this.wx.current.weather.length > 1){
			conditions = Array.from(this.wx.current.weather).map(val => val.description ).join(" & ");
		}else{
			conditions = this.wx.current.weather[0].description; 
		}
		return conditions;
	}

	// Get a proper weather report. (Returns an object)
	async setCurrentObservation(){
		const now = await this.getCurrent();  			// shorter that this.wx.current
		// XXX: Some places don't return a zip code.
		const dt  = new DateTime(now.dt); 				// More than likely this time was set on when the report was.
		this.report["date"]          = dt.toDate();
		this.report["time"]          = dt.toTime();  	// TODO: Check the timezone
		this.report["conditions"]    = await this.getCurrentConditions();
		this.report["temperature"]   = tempF(now.temp);
		this.report["feels_like"]    = tempF(now.feels_like); 	// TODO: Wind Chill? Heat Index?
		this.report["humidity"]      = percent(now.humidity);
		this.report["dew_point"]     = tempF(now.dew_point);
		// TODO: Has it gone up or down in the last hour?
		this.report["pressure_inHg"] = inHg(now.pressure);
		this.report["pressure_mbar"] = mbar(now.pressure); 
		// TODO: What if the wind is calm?
		let wind = wind_mph(now.wind_speed);
		let [ beux, desc ]  = wind_beaufort(now.wind_speed); 	// Just for fun, let's add the beaufort scale value.
		this.report["wind"]          = (wind < 1.0) ? "Calm" : `${wind_dir(now.wind_deg)} at ${wind_mph(now.wind_speed)}${(now.wind_gust) ? ' gusting to ' + wind_mph(now.wind_gust) : ""} (${desc})`;
		this.report["uv_index"]      = now.uvi;  // TODO: Show the levels.
		this.report["cloudiness"]    = percent(now.clouds);  // How cloudy is the sky? (TODO: what consitutudes clear, partly cloudy, mostly cloud, and overcast? What if there is fog or mist? 
		this.report["visibility"]    = dist_mi(now.visibility);  // Almost forgot this.
		// TODO: there are '1h' and '3h' in both 'rain' and 'snow'
		// TODO: What about ice or sleet or freezing rain?
		if(now.rain){
			this.report["rain"] = `Rain in the last hour ${precip_in(now.rain['1h'])}`;
		}
		if(now.snow){
			this.report["snow"] = `Snow in the last hour ${precip_in(now.snow['1h'])}`;
		}
		
		this.report["sunrise"]       = new DateTime(now.sunrise).toTime();
		this.report["sunset"]        = new DateTime(now.sunset).toTime();

		return this;
	}
	
	async getCurrentObservation(){return this.report;}

	async printCurrentObservation(){
		let fields  = {
			"Currently_in" : this.geo.loc,
			"At"           : `${this.report.date} ${this.report.time}`,
			"Temperature"  : this.report.temperature,
			"Feels_Like"   : this.report.feels_like, // TODO: Is there a way to put this on the same line as Temperature
			"Humidity"     : this.report.humidity,
			"Dew_Point"    : this.report.dew_point,  // TODO: Is there a way to put this on the same line as Humidity?
			"Pressure"     : `${this.report.pressure_inHg} (${this.report.pressure_mbar})`,
			"Wind"         : this.report.wind,
			"UV_Index"     : this.report.uv_index,
			"Cloudiness"   : this.report.cloudiness,
			"Visibility"   : this.report.visibility
		};
		if(this.report.rain){
			fields["Rain"] = this.report.rain;
		}
		if(this.report.snow){
			fields["Snow"] = this.report.snow;
		}
		fields["Sunrise"] = this.report.sunrise;
		fields["Sunset"]  = this.report.sunset;
		//let longest = Object.keys(fields).reduce((val,idx) => Math.max(val.length,idx.length) , 0) + 1;
		let longest = Object.keys(fields).reduce((val,idx) => (val.length > idx.length) ? val : idx, "").length + 1;
		//console.log(longest);
		//console.log("getCurrentObservations (this.report)");
		//let obs = []; 	// Observations
		let no_break = ["Temperature","Humidity","Sunrise"];
		Object.entries(fields).forEach(([k,v]) => {
			//console.log(typeof(k));
			//console.log(k.replaceAll(/_/g," "));
			let label = k.replace(/_/g," ").concat(":").padEnd(longest," ");
			let value = v;
			let ending = no_break.includes(k) ? " " : "\n";
			process.stdout.write(`${label} ${value}${ending}`);
		});
	}

	async getAlertCount(){
		let alerts = await this.getAlerts();
		return (alerts) ? alerts.length : 0;
	}

	async getCurrentAlerts(full=false){
		let alerts = await this.getAlerts();
		if(alerts){
			if(full){
				return alerts.map(alert => alert.description);
			} else {
				return alerts.map(alert => {
					let dt_start = new DateTime(alert.start);
					let dt_end   = new DateTime(alert.end);
					let start    = `${dt_start.toDate()} ${dt_start.toTime()}`; 
					let end      = `${dt_end.toDate()} ${dt_end.toTime()}`; 
					return `The ${alert.sender_name} has issue a ${alert.event} from ${start} until ${end}.`;
				});
			}
		}
	}

	// This will be useful for our short alerts
	async printCurrentAlerts(full=false){
		let alerts = await this.getAlerts();

		if(alerts){
			console.log("---");
			console.log(`There are currently ${alerts.length} alerts in this location.`);
			console.log("---");

			if(full){
				for(let alert of alerts){
					// alert.description shows the full alert message
					console.log(alert.description);
					console.log("---");
				}
			}else{
				for(let alert of alerts){
					let dt_start = new DateTime(alert.start);
					let dt_end   = new DateTime(alert.end);
					let start    = dt_start.toDate() + " " + dt_start.toTime();
					let end      = dt_end.toDate() + " " + dt_end.toTime();
					console.log(`The ${alert.sender_name} has issued a ${alert.event} from ${start} until ${end}`);
				}
			}
		} else {
			console.log("No alerts are in effect.");
		}
		// comment out that else statement to return nothing if no alerts
	}
	// TODO: Functions for forecast later.
}

module.exports = Weather;
