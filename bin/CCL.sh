#!/bin/bash
# File: CCL.ssh
# What the sed commands do:
# 1. Get rid of the hidden carriage returns (^M) (This will convert our data to a Unix format in the process.)
# 2. Remove the first 16 lines. We don't need them.
# 3. Because the first line is blank, change it to have an opening square brace.
# 		Unfortunately, we can't do this on a blank line, 
# 		so I need to piggy-back off the first record's pattern to insert a line.
# 4. Because everything has an index, we can use that index as an id number.
# 5. REMARKS is the last attribute in each record. We can use it at the end of the record to make the ending right.
# 6. We can modify the all the other properties.
# 7. Replace that comma at the last curly brace in the document with a new line and a closing square bracket.
# 8. Add another line that has a closing bracket. (I can't believe the reverse isn't this simple!)
# 9. Remove all the blank lines.
# Notes: 
# * I assume `1c[` should have the same effect as `1s/^$/[/'
# * Apparently `\d` doesn't work. So I will have to use `[0-9]`
curl -sSL https://www.weather.gov/source/nwr/JS/CCL.js | \
sed \
	-e 's/\r$//g' \
	-e '1,16d' \
	-e '/^ST\[0\] = .*/i\\x5B' \
	-e 's/^ST\[\([0-9]\+\)\] = \(".*"\);/\t{\n\t\t"id" : \1,\n\t\t"st" : \2,/g' \
	-e 's/^\(REMARKS\)\[[0-9]\+\] = \(".*"\);/\t\t"\L\1\E" : \2\n\t},/g' \
	-e 's/^\([A-Z]\+\)\[[0-9]\+\] = \(".*"\);/\t\t"\L\1\E" : \2,/g' \
	-e 'x;${s/\},/\}/;p;x};1d' \
	-e '$a\\x5D' \
	-e '/^$/d' > ../data/CCL.json
	#"$@"
