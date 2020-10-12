/* @file ccl_table.js
 * @desc show our list as a table.
 */
const fs = require('fs');
const MDTable = require("../local/MDTable");

//console.log(process.argv);

const file = process.argv[2];
// TODO: convert CSV to JSON
// TODO: get the json file from an argument
const raw = fs.readFileSync(file); 	// read the data from a file
const json = JSON.parse(raw); 					// Parse it into JSON format
const table = new MDTable(json);
table.print();
//table.printHTML();

