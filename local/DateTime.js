// @file: local/DateTime.js
// @desc: Apply some common date and time formats
//import { pad0, slice } from 'Format.js';
const { pad0, slice } = require('./Format');

// TODO: Rewrite this class some other timet input/output date info UNIX `date` style.
class DateTime {
	constructor(data){ 			// data should be a numerical time stamp  (TODO: Probably should rewrite this in typescript later.)
		//console.log(data);
		//console.log(typeof data);
		this.datetime = new Date(data * 1000);  // Multiply by 1000 because the time stamp in OWM doesn't include milliseconds
		//console.log(this.datetime);
	}
	// Contrary to what ESLink thinks, there is nothing wrong with our static variables.
	static weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	static months   = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	getDay(size=0){
		let dotw = this.datetime.getDay(); // 0-6
		if(size === -1){
			return dotw; 	// return index
		} else if(size === 0) {
			return DateTime.weekdays[dotw]; // return value
		} else {
			return slice(DateTime.weekdays[dotw],size); // return sliced value
		}
	}
	getMonth(size=0){
		let month = this.datetime.getMonth(); // 0-11
		if(size === -3){
			return pad0(month+1);  // return month number with a leading zero for values less than 10.
		} else if(size === -2){
			return month+1;   // return month number
		} else if(size === -1){
			return month; // return index
		} else if(size === 0){
			return DateTime.months[month]; 	// return value
		} else {
			return slice(DateTime.weekdays[dotw],size);  // return sliced value
		}
	}
	getDate(leading = false){
		let day = this.datetime.getDate(); 	// 1 - 31
		return (leading) ? pad0(day) : day;
	}
	getYear(){
		return this.datetime.getFullYear();  // four digit year
	}
	getHours(leading=false,twelve=false){
		let hour = this.datetime.getHours();
		if( leading === false && twelve === false){
			return hour; 							// return 24 hour format
		} else if( leading === false && twelve === true){
			return (hour > 12) ? (hour - 12) : hour; // return 12 hour format
		} else if( leading === true && twelve === false){
			return pad0(hour); 						// return 24 hour format with leading zero
		} else {  // true and true
			return (hour > 12) ? (hour - 12) : hour; // return 12 hour format with leading zero
		}
	}
	getMinutes(leading = true){ 					// Here we want the default to be true
		let minute = this.datetime.getHours();
		return (leading) ? pad0(minute) : minute; 
	}
	getSeconds(leading = true){
		let second = this.datetime.getSeconds();
		return (leading) ? pad0(second) : second; 
	}
	getAMPM(){
		return (this.getHours() < 11) ? "AM" : "PM";
	}
	// TODO: getTZ() to get the abbreviated timezone. Might want to look at moment.js
	// getTZ(){}
	// Show date
	toDate(size="S"){
		if(size === "XL"){
			return `${this.getDay()}, ${this.getMonth()} ${this.getDate()}, ${this.getYear()}`;
		} else if(size === "L"){
			return `${this.getMonth()} ${this.getDate()}, ${this.getYear()}`;
		} else if(size === "M"){
			return `${this.getMonth(3)} ${this.getDate(true)}, ${this.getYear()}`;
		} else if(size === "S"){
			return `${this.getMonth(-3)}/${this.getDate(true)}/${this.getYear()}`;
		} else {
			return new Error("Invalid Size");
		}
	}
	// show time
	toTime(size="M"){
		// TODO: Add more sizes
		if(size === "M"){
			return `${this.getHours(true,true)}:${this.getMinutes()} ${this.getAMPM()}`;
		} else if(size === "S"){
			return `${this.getHours(true)}:${this.getMinutes()}`;
		} else {
			return new Error("Invalid Size");
		}
	}
};

module.exports = DateTime;
