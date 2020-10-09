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

For a list of options, use the help option `-h`.

TODO: Copy the contents from the `help` function to this file later.

## FAQ

TODO: Add some questions here later.

