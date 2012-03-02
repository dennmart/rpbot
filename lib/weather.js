var http = require('http'),
    xml2js = require('xml2js');

exports.currentConditions = function(weatherLocation, room) {
  // Uses Google's unofficial and unsupported Weather API - may cease to exist at any moment.
  var options = {
    host: 'www.google.com',
    port: 80,
    path: '/ig/api?weather=' + escape(weatherLocation)
  };

  http.get(options, function(res) {
    var data = "";
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function() {
      parser.parseString(data);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

  var parser = new xml2js.Parser();
  parser.addListener('end', function(result) {
    var response = result;

    if (response.weather.problem_cause !== undefined) {
      room.speak("I couldn't find any weather conditions for " + escape(weatherLocation) + ". Make sure you entered a valid location, or try again later.");
    } else {
      try {
        var cityName = response.weather.forecast_information.city['@'].data,
            condition = response.weather.current_conditions.condition['@'].data,
            tempFahrenheit = response.weather.current_conditions.temp_f['@'].data,
            tempCelsius = response.weather.current_conditions.temp_c['@'].data,
            humidity = response.weather.current_conditions.humidity['@'].data,
            windCondition = response.weather.current_conditions.wind_condition['@'].data;

        room.speak("Current weather conditions for " + cityName + ": " + condition + ", " + tempFahrenheit + " °F (" + tempCelsius + " °C) - " + humidity + ", " + windCondition);
      } catch (e) {
        room.speak("There was an error fetching weather conditions for " + escape(weatherLocation) + ". Please enter another location.");
      }
    }
  });
};
