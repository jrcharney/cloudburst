# CODEBURST
part of LightniNG/Blitz

Command line weather powered by OpenWeatherMaps.

## USAGE

```
node index.js ["LOCATION"] [ARGS]
```

* If you don't enter a location at all, the `--ip` option will be used and we will find you (unless you use a VPN).
* If you enter a location but forget the `--location` part of the tag, that's OK, it will be used by default.
* Locations probably should be quoted.
* To avoid getting weather in other countries, I've specified the default country to the United States (`US`).

## OPTIONS

| Option                  | Description                                                                               |
|-------------------------|-------------------------------------------------------------------------------------------|
| `--ip`                  | Get location by IP address                                                                |
| `--json`                | JSON output (useful for piping into another app)                                          |
| `--location="LOCATION"` | Get the current observation for a specific location using city and state or Zip Code.     |
| `--country=CC`          | Get the weather from a specific country. By default, this is in the United States (`US`). |
| `--lang=LANG`           | Get the weather in a specific language. By default, this is in English (`en`).            |
| `--units=UNITS`         | Report the weather either in `standard`, `metric`, or `imperial` (default)                |
| `--show=[items]`        | Show certain data                                                                         |
| `--hide[items]`         | Hide certain data that shows by default                                                   |

Multiple items can be used with teh `--show` and `--hide` options provided options are comma-separated.

### Show Items

I got a little 'feature happy' with this project, so anything that was successful or useful became a feature.

With the `--show=` option, the following options are available.

| Show Option      | Shows                                                                                    |
|------------------|------------------------------------------------------------------------------------------|
| `geodata`        | Geographic information                                                                   |
| `location`       | City, State, and Zip Code or Country                                                     |
| `coords`         | Latitude and Longitude                                                                   |
| `weather`        | Current weather (as JSON)                                                                |
| `raw_alerts`     | Alerts (as JSON)                                                                         |
| `raw_conditions` | Current weather condtion description                                                     |
| `conditions`     | Weather conditions as a formated object                                                  |
| `alerts`         | Current list of weather alerts. (use `--full` for full messages)                         |
| `minutely`       | **COMING SOON!** Minute-by-minute weather forecast. (Produces way too much data)         |
| `hourly`         | **COMING SOON!** Hour-by-hour weather forecast. (Produces a lot of data)                 |
| `daily`          | **COMING SOON!** Day-by-day weather forecast. (This will likely be the next big feature) |

### Hide Items

With the `--hide=` option, the following options are available.

| Hide Option | Hides                     |
|-------------|---------------------------|
| `condtions` | Current weather condtions |
| `alerts`    | Any weather alerts        |

## Credits

* Created by Jason Charney (jrcharneyATgmailDOTcom)
* Part of LaunchCode Liftoff St. Louis 2020 Capstone Project
* https://jrcharney.github.io/Cloudburst/
* https://github.com/jrcharney/Cloudburst/
* (C) 2020

