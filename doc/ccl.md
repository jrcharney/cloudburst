# CCL.sh

**CCL.sh** is a script that turns `CCL.js` into `CCL.json`.

## Short history

In the process of trying to find out how to get all the SAME codes used by NOAA weather radio, 
I stumbled upon a file that had all the information I was looking for...but it was as JavaScript file.
So just for fun, and as a courtesy to the most awesome part of the Federal Goverment 
(which is why Wilbur Ross must be removed before he puts anymore climate change deniers in the Commerce Department!), 
I decided to reprocess all the data that was in that file into a JSON file.
The result was much more plesant, but being the person that I am, I wanted to see if I could
Make this data into a smaller file.

Eventually, I'd like to make a faux-database out of this.
Even with my fiddling around, I was only able to shave off a few hundred kilobites from a file that is still over 2MB.
A more scintillating solution still piques my interest.

In the `bin` directory is a Bash script that fetches this information named for the file 
that I found this data: [ccl.sh](./bin/ccl.sh).
The information appears to be live as the status of the operations of the radio station likely need to be updated.

I've had fun playing with this file with has over 3000 records in it.
(I wonder if there is a Zip code database that corresponds with it. (MASH IT UP! `\../. ^_^ .\../`))

<3

## Columns

| Field       | Type     | Description                                                  | Tables                 | Notes                                                                                     |
|-------------|----------|--------------------------------------------------------------|------------------------|-------------------------------------------------------------------------------------------|
| `id`        | `number` | Index number                                                 | `Station`              |                                                                                           |
| `st`        | `string` | State abbreviation                                           | `State`                |                                                                                           |
| `state`     | `string` | State name                                                   | `State`                |                                                                                           |
| `county`    | `string` | County                                                       | `County`               |                                                                                           |
| `same`      | `string` | Six digit SAME code                                          | `County`               | See "SAME" below.                                                                         |
| `sitename`  | `string` | Radio station name                                           | `Station`              |                                                                                           |
| `siteloc`   | `string` | Radio station location                                       | `Station`              |                                                                                           |
| `sitestate` | `string` | Radio station state abbreviation                             | `Station`              |                                                                                           |
| `freq`      | `string` | Radio station frequency                                      | `Station`, `Frequency` | TODO: Replace with `Frequency.channel`                                                    |
| `callsign`  | `string` | Radio station call sign                                      | `Station`              |                                                                                           |
| `lat`       | `string` | Radio station latitude?                                      | `Station`              | TODO: Convert to a number?                                                                                          |
| `lon`       | `string` | Radio station longitude?                                     | `Station`              | TODO: Convert to a number?                                                                                          |
| `pwr`       | `string` | Radio station power                                          | `Station`              | I was thinking this was in Watts, but I highly doubt there is a 5 Watt station in Alaska.                           |
| `status`    | `string` | Radio station status                                         | `Station`              | This column is updated automatically by mechanisms beyond my reach.                                                 |
| `wfo`       | `string` | Radio station Weather Forecast Office (City and State Abbr.) | `Station`              |                                                                                           |
| `remarks`   | `string` | Station Remarks                                              | `Station`              |                                                                                           |

### SAME

The same code has SIX digits for a reason.

The second and third digits make up state FIPS codes.
The last three character make out the conty FIPS codes.

But the FIRST character does have meaning!

`PSSCCC`

| P | Name                                        |
|---|---------------------------------------------|
| 0 | All or an unspecificed portion of a county. |
| 1 | Northwest                                   |
| 2 | North                                       |
| 3 | Northeast                                   |
| 4 | West                                        |
| 5 | Central                                     |
| 6 | East                                        |
| 7 | Southwest                                   |
| 8 | South                                       |
| 9 | Southeast                                   |

Other numbers may be designated for later for special applications.
The use of county subdivisions will probably be rare and generally for oddly shaped or unusually large counties.
Any subdivisions must be defined and agreed to by the local officials prior to use.

The SAME code is part of the EAS protocol (CFR 2020 Title 47 Volume 1 Section 11.31)

> TODO: Write what the rest of the messages mean later in an EAS Protocol section.

## Extractions

```bash
## Get the State FIPS info
cat CCL.json | jq '[.[] | {fips_st: .same[1:3], st: .st, state: .state}] | unique_by(.st) | sort_by(.fips_st)' > states.json
## Get the FIPS info (SSCCC)
cat CCL.json | jq '[.[] | {fips: .same[1:6], county: .county, st: .st}] | unique_by(.fips) | sort_by(.fips)' > counties.json
```

The number we have is LONGER that the number Wikipeida has.
* Wikipedia has 3242 counties and county equivalents
* `counties.json` has 3295 records
* Why is there a difference of 53? 

---

## Sources

* https://www.govinfo.gov/content/pkg/CFR-2010-title47-vol1/xml/CFR-2010-title47-vol1-sec11-31.xml


