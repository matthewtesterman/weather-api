/**
 * @file Weather Application
 * @author Matthew Testerman <matthewtesterman83@gmail.com>
 * @version 0.1
 */
/*Global Variables*/
var interval; //global scope var for weather loop

/*JQuery on ready*/
$(function() {
  /*Upon submitting form
  *
  * @param {event} e - event object
  */
  $("form").submit(function(e) {
    e.preventDefault();
    $("#loading").css("display", "block"); //display loading
    var cityName = $("#cityName").val(); //grab user input
    clearInterval(interval); //clear event cycle (if currently in one).
    weather = new Weather(cityName); //instatiate new weather object.
    weather.getWeatherData(); //get weather data, update view.
    //start cycle to check for updates every 5000.
    interval = setInterval(function() {
      weather.getWeatherData();
    }, 5000);
  });
});

/**
 * The Weather Object.
 */
class Weather {
  /**
   * City Name
   * @constructor
   * @param {string} cityName - Name of City
   */
  constructor(cityName) {
    this.cityName = cityName;
  }
  /**Ajax call for weather data from openweathermap.org**/
  getWeatherData() {
    var me = this;
    $.ajax({
      dataType: "json",
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        this.cityName +
        "&units=imperial&appid=2bd0df71d0b70b21b9f7e1ebdd339548",
      success: function(data) {
        var weatherObj = {};
        //If success then get all data back and assign to data to current object
        $("#wa-error").css('display', 'none');
        if (data.cod == "200") {
          me.weatherType = data.weather[0].main;
          me.weatherTypeID = data.weather[0].id;
          me.temperature = Math.round(data.main.temp);
          me.humidity = Math.round(data.main.humidity);
          me.highTemp = Math.round(data.main.temp_max);
          me.lowTemp = Math.round(data.main.temp_min);
          me.windSpeed = data.wind.speed;
          me.weatherIcon = data.weather[0].icon;
          me.windDeg = data.wind.deg;
          me.sunrise = data.sys.sunrise;
          me.sunset = data.sys.sunset;

          /**Determine if day or night from icon name string (n or d)**/
          if (me.weatherIcon.substring(2, 3) === "d") {
            me.isDay = true;
          } else {
            me.isDay = false;
          }
          /*Bind Values to the view*/
          me.bindVal();
        } else {
          alert("There as issue with the weather data service.");
        }
      },
      async: false,
      error: function(xhr, ajaxOptions) {
        /**if data returned error**/
        clearInterval(interval); //break loop
        clearValues(); //clear current values from view
        $("#wa-error").css('display', 'block'); //display direction to end user.
        $("#loading").css("display", "none"); //hide loading screen.
      }
    });
  }
  /**Bind values to the view**/
  bindVal() {
    if (typeof this.temperature !== "undefined") {
      $("#wa-temperature").html(
        '<i class="fa fa-thermometer-half" aria-hidden="true"></i> ' +
          this.temperature +
          " &#8457;"
      );
      $("#wa-wind-speed").html(
        '<i class="fa fa-flag" aria-hidden="true"></i> Winds from ' +
          this.toTextualDescription(this.windDeg) +
          " at " +
          Math.round(this.windSpeed) +
          " mph."
      );
      $("#wa-conditions").html(this.weatherType);
      $("#wa-locTime").html(this.locTime);
      $("#wa-humidity").html(
        '<i class="fas fa-tint"></i> ' + this.humidity + "%"
      );
      $("#wa-temp-range").html(
        "H " + this.highTemp + "&#8457 <br />L " + this.lowTemp + "&#8457"
      );
    } else {
      $("#wa-wind-speed").html("Incorrect Location.");
      $("#wa-temperature").html("");
      $("#wa-conditions").html("");
    }
    $("#weather-img").html(
      '<img class="img-fluid" src="https://www.matthewtesterman.com/assets/img/' +
        this.weatherIcon +
        '.svg" style="height: 150px"/>'
    );
    if (this.isDay) {
      $("body").css("background-color", "#00BFE7");
    } else {
      $("body").css("background-color", "#0F3C4B");
    }
    $("#loading").css("display", "none");
  }
  /*Determine wind direction based of degree
   *@return {string} Wind Direction
  */
  toTextualDescription(degree) {
    if (degree > 337.5) return "N";
    if (degree > 292.5) return "NW";
    if (degree > 247.5) return "W";
    if (degree > 202.5) return "SW";
    if (degree > 157.5) return "S";
    if (degree > 122.5) return "SE";
    if (degree > 67.5) return "E";
    if (degree > 22.5) {
      return "NE";
    }
    if (typeof variable === "undefined") {
      return "";
    } else {
      return "N";
    }
  }
} //End of Weather Class

/**Clears Values from the View **/
function clearValues() {
  $("#wa-temperature").html("");
  $("#wa-wind-speed").html("");
  $("#wa-conditions").html("");
  $("#wa-locTime").html("");
  $("#wa-humidity").html("");
  $("#wa-temp-range").html("");
  $("#weather-img").html("");
}
