// @file local/wx_format.js
// @description : Define a static library of functins to format text for weather information

// These convert into imperial units.
const wx_format = {
	// Temperature format
	// Because some terminals won't render the degree symbol, an extra setting is added for when we start showing this data in HTML
	tempC   : function(data,html=false){ 			// This is for metric
		let t = data.toFixed(1);
		return (html) ? `${t}&deg;C`  : `${t} C `;
	},
	tempF   : function(data,html=false){ 			// this is for imperial
		let t = data.toFixed(1);
		return (html) ? `${t}&deg;F`  : `${t} F `;
	},
	// Typically we want no decimals after our percentage
	percent : function(data,places=0){return `${data.toFixed(places)}%`}, 					// Percent format.
	// Note: hPa = mbar
	mbar    : function(hPa){return `${hPa} mb`},
	inHg    : function(hPa){return `${(hPa * 0.030).toFixed(2)} in. Hg`;}, 	// Pressure converted from hPa (a.k.a. mbar) into inches Mercury.
	// Thank goodness I wrote this in another app in ruby years ago!
	wind_dir : function(angle){ // Angle is in degrees
		let dir = "";
		if(      angle >= 348.75 || angle < 11.25  ){dir = "N";}
		else if( angle >= 11.25  && angle < 33.75  ){dir = "NNE";}
		else if( angle >= 33.75  && angle < 56.25  ){dir = "NE";}
		else if( angle >= 56.25  && angle < 78.75  ){dir = "ENE";}
		else if( angle >= 78.75  && angle < 101.25 ){dir = "E";}
		else if( angle >= 101.25 && angle < 123.75 ){dir = "ESE";}
		else if( angle >= 123.75 && angle < 146.25 ){dir = "SE";}
		else if( angle >= 146.25 && angle < 168.75 ){dir = "SSE";}
		else if( angle >= 168.75 && angle < 191.25 ){dir = "S";}
		else if( angle >= 191.25 && angle < 213.75 ){dir = "SSW";}
		else if( angle >= 213.75 && angle < 236.25 ){dir = "SW";}
		else if( angle >= 236.25 && angle < 258.75 ){dir = "WSW";}
		else if( angle >= 258.75 && angle < 281.25 ){dir = "W";}
		else if( angle >= 281.25 && angle < 303.75 ){dir = "WNW";}
		else if( angle >= 303.75 && angle < 326.25 ){dir = "NW";}
		else if( angle >= 326.25 && angle < 348.75 ){dir = "NNW";}
		return dir;
	},
	wind_ms   : function(speed){return `${Math.floor(speed)} m/s`}, 	 // metric
	wind_mph  : function(speed){return `${Math.floor(speed)} MPH`;},	 // imperial
	// TODO: wind_knots
	// TODO: wind_kmh (km/h) 
	wind_beaufort : function(speed){ // speed is set for MPH. If this a problem, try knots or m/s
		// Show the beaufort scale and description
		let beaufort = [
			"Calm",
			"Light air",
			"Light breeze",
			"Gentle breeze",
			"Moderate breeze",
			"Fresh breeze",
			"String breeze",
			"High wind", 	// moderate gale or near gale
			"Gale", 		// fresh gale
			"Strong gale",  // strong/severe gale
			"Storm", 		// whole gale
			"Violent storm",
			"Hurricane force"
		];

		let idx;
		if(speed < 1){                     idx =  0;}
		else if(speed >=  1 && speed <  4){idx =  1;}
		else if(speed >=  4 && speed <  8){idx =  2;}
		else if(speed >=  8 && speed < 13){idx =  3;}
		else if(speed >= 13 && speed < 19){idx =  4;}
		else if(speed >= 19 && speed < 25){idx =  5;}
		else if(speed >= 25 && speed < 32){idx =  6;}
		else if(speed >= 32 && speed < 39){idx =  7;}
		else if(speed >= 39 && speed < 47){idx =  8;}
		else if(speed >= 47 && speed < 54){idx =  9;}
		else if(speed >= 55 && speed < 64){idx = 10;}
		else if(speed >= 64 && speed < 73){idx = 11;}
		else{idx = 12;}
		return [ idx, beaufort[idx] ]; // Return the beaufort number and description
	},
	precip_mm : function(mm){   return `${mm.toFixed(2)} mm`;},			 // metric
	precip_in : function(mm){   return `${(mm/25.4).toFixed(2)} in.`;},	 // imperial
	dist_m    : function(m){    return `${m.toFixed(2)} m`;}, 			 // metric
	dist_mi   : function(m){    return `${(m/1609.344).toFixed(2)} mi`;} // imperial
};

module.exports = wx_format;
