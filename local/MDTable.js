// @file MDTable.js
// @desc process table data from JSON into markdown or HTML

// @class MDTable
// TODO: Convert data into HTML table.
class MDTable {
	// @param data : An array of objects from JSON data.
	// @param cc = "|" : Column character.
	// @param dc = "-" : Divider character.
	constructor(data,cc="|",dc="-"){
		this.data    = data;
		this.columns = Object.keys(data[0]);
		this.widths  = this.columns.map(col => MDTable.longest(this.data,col));
		// The parts array specifies the appearance of the first column, the coulumns in between, and the last column
		// TODO: Set the column character for a personalized style!
		this.parts   = [`${cc} `,` ${cc} `,` ${cc}`];
		this.div     = dc;
	}
	// @func MDTable.longest
	// @param list : An Array of Objects form JSON data
	// @param column : A String reprsening a string
	// @returns Number
	// @desc Get the lenght of the longest value in a record.
	// TODO: Do we need to convert to a string for non-string values?
	// TODO: Allow for an option truncate the label if it is longer than the width of the widest data.
	static longest(list,column){
		// let items   = list.map(item => item[column]); 	// just get a column from each record and put it in an array.
		// let longest = items.reduce((acc,idx) => ...);    // find the longest word
		// return longest.length; 							// return the lenght of the longest word.
		let width = list.map(item => item[column]).reduce((acc,idx) => (acc.length > idx.length)? acc : idx).length;
		// Before we go, is the column name longer than the rest of the data?
		return (width > column.length) ? width : column.length;
	}
	// @func MDTable.record
	// @param columns : Array of Strings representing the name of each column
	// @param widths : Array of Numbers representing with width of the longest value
	// @param parts : The strings that represent the left column pad, the column divder, and righ column pad
	// @returns String
	// @desc returns a formatted record
	// TODO: allow alignments (default is left because of padEnd. It would be right if we used padStart.)
	// TODO: Center alignment
	static record(columns,widths,parts){
		// TODO: Throw if no widths
		// TODO: Throw if no parts
		return parts[0] + columns.map((col,idx) => col.padEnd(widths[idx]," ")).join(parts[1]) + parts[2];
	}
	// @func getHeader
	// @return String
	// @desc Return header
	getHeader(){
		//return this.parts[0] + this.columns.map((col,idx) => col.padEnd(this.widths[idx]," ")).join(this.parts[1]) + this.parts[2];
		return MDTable.record(this.columns,this.widths,this.parts);
	}
	// @func getDivders
	// @return String
	// @desc  Returns the divder between the header and body using the header to define the divider.
	getDivider(){
		return this.getHeader().replace(/[^|]/g,this.div);
	}
	getColumns(){
		return this.columns;
	}
	// @func getRecord
	// @param item an object in 
	// @return String
	// @desc process each record
	getRecord(item){
		return MDTable.record(item,this.widths,this.parts);
	}
	// @func getTableHead
	// @return Array of Strings
	// @Return the header and the divider as one array.
	getTableHead(){
		return [].concat(this.getHeader(),this.getDivider());
	}
	// @func getTableBody
	// @return Array of Strings
	// @desc returns the processed table data
	getTableBody(){
		return this.data.map(row => this.getRecord(Object.values(row)));
	}
	// @func getTable
	// @return Array of Strings
	// @desc return the contents of a table.
	getTable(){
		return [].concat(this.getTableHead(),this.getTableBody());
	}
	// @func getRawData
	// @return Array of Objects from JSON data.
	getRawData(){
		return this.data;
	}
	// @func print
	// @return void
	// @desc print the data 
	// TODO: alternative to console.log, process.stdout?
	print(){
		let table = this.getTable();
		for(let row of table){
			console.log(row);
		}
	}
	// @func getHTMLTable
	// @returns HTML Elements
	// @desc Returns our data as an HTML table using DOM.
	getHTMLTable(){
		let table = document.createElement("table");
		let thead = document.createElement("thead");
		let thead_tr = document.createElement("tr");
		for(let col in this.columns){
			let th = document.createElement(th);
			th.innerHTML = col;
			thead_tr.append(th);
		}
		thead.append(thead_tr);
		let tbody = document.crateElement("tbody");
		for(let row of this.data){
			let tr = document.createElement("tr");
			for(let data of row){
				let td = document.createElement("td");
				td.innerHTML = data;
				tr.append(td);
			}
			tbody.append(tr);
		}
		table.append(thead,tbody);
		return table;
	}
	// @func printHTML Table
	// This might not work (Nope. Because There is no "document"
	printHTML(){
		console.log(this.getHTMLTable());
	}
}


module.exports = MDTable;
