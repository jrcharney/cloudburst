# Cloudburst

Cloudburst is a Command line weather program that I will integrate into LightniNG/Blitz.

## About

I think I screwed up LightniNG, so I'm trying it again as another program called Blitz.

Blitz will be like an Angular app I wrote back in LC101, but tweaked to read the data from Cloudburts.

Cloudburst is featurefull. It uses OpenWeatherMap API for weather data, IPInfo for IP address lookup, and Node-Geocoder for geolocation.

## Requirements

You will need to get a IPInfo token from IPInfo.io and a API token from OpenWeatherMap and put them into an `.env` file.

## Install

1. Clone this repo (or if it ever appears on NPM someday, install it from there.)
2. Run `npm install` to download any depedencies. (It should fetch the stuff from `package.json`.
3. Create an `.env` file with the IPInfo and OpenWeatherMap API tokens.
4. Run `node index.js`. Add arguments to find locations or output specific info.

## Use

For a list of options, use the help option `-h` or look at the [Help](doc/help.md) file.

## FAQ

TODO: Add some questions here later...or better yet another file.


## Wishlist

> TODO: Make use of that Projects feature in Github and see if I can put this in a Kanban board.

* [ ] Tide Calculator
* [ ] Moon phases/moon rise/moon set
* [ ] Eclipse finder (solar and lunar)
* [ ] Earthquake summary (See what's shaking within a specific radius)
* [ ] Sunrise and Sunset for other days and locations
* [ ] Better time zone support and date/time input
* [ ] METAR style output (single line)
* [ ] EAS Protocol support (Better warnings, at least in North America.)
* [ ] Better support for metric.
* [ ] Tsunami/Volcano check
* [ ] COLORS!
* [ ] NOAA Weather Radio Database using JSON. (See [CCL](doc/ccl.md)) 
* [ ] Some cool [figlet](http://www.figlet.org/) and/or [boxes](https://boxes.thomasjensen.com/) logo

Most of that will be command line and scraping the web.

