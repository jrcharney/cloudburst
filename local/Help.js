// @file local/Help.js
// @desc Read the locat help file
const fs = require('fs');  // We'll use this to read the help file

function help(){
	// TODO: What's the difference between readFile and readFileSync?
	let ayuda = fs.readFileSync('./doc/help.md', 'utf8');
	console.log(ayuda);
	// TODO: exclude=""
	process.exit(); // leave the program with this option
}


module.exports = { help };
