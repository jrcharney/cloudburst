// @file local/Format.js
// @desc static String formatting

let Format = {
	// Pad is useful for numbers
	pad0 : function(data,size=2){ return data.toString().padStart(size,'0')},
	// Slice is useful for strings
	slice : function(data,size=3){ return data.slice(size);}
};


module.exports = Format;
