// Location Coordinates
// organize code
// cloropeth based on income
// markers for agencies with popups


var myMap = L.map("map", {
  center: [32.8407, -83.6324],
  zoom: 8,
});

function createMap(county) {
  // Create the base layers.
  var street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',}
  );
  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Counties: county,
    Departments: loclayer,
  };


  var legend = L.control(
    {
      position: "bottomright"
    }
  )

  legend.onAdd = function()
  {
      var div = L.DomUtil.create("div", "info legend");

      // departmentIntervals = ['Non-Crime', 'NaN', 0, 25, 75]
     
      // departmentColor = [
      //   'blue',
      //   'violet',
      //   'red',
      //   'yellow',
      //   'green'
      // ]

      // for(a=0; a<departmentIntervals.length; a++)
      // {
      //   div.innerHTML += "<i style='background: " + departmentcolors[i] + "'></i>" 
      //     + '$' + departmentintervals[i] + (departmentintervals[i+1]  ? ' &ndash; ' + departmentintervals[i+1] + ' <br>': '+')
      // }

      var intervals = [0, 37500, 55000, 70000];

      var colors = [
          '#FF0000',
          '#ff4500',
          '#00FFFF',
          '#008000'
      ]

      for(var i=0; i<intervals.length; i++)
      {
          div.innerHTML += "<i style='background: " + colors[i] + "'></i>" 
          + '$' + intervals[i] + (intervals[i+1]  ? ' &ndash; ' + intervals[i+1] + ' <br>': '+')
      }
      return div;
  }
  legend.addTo(myMap)

  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);
}
d3.json('data/crimes_location.json').then(
  function(crimes){
    {
      crimedct = []

      for(i = 0; i < crimes.data.length; i++){
        loc = crimes.data[i].agency_name
        clear = crimes.data[i].cleared
        actual = crimes.data[i].actual
        percent = ((clear/actual)*100).toFixed(2)

        var markerColor;

        if(percent > 75)
          markerColor =  new L.Icon({
            iconUrl: 'img/marker-icon-2x-green.png',
            shadowUrl: 'img/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
        
        else if(percent > 25)
          markerColor =  new L.Icon({
            iconUrl: 'img/marker-icon-2x-yellow.png',
            shadowUrl: 'img/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

        else if(percent >= 0)
          markerColor =  new L.Icon({
            iconUrl: 'img/marker-icon-2x-red.png',
            shadowUrl: 'img/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

        else 
          markerColor =  new L.Icon({
            iconUrl: 'img/marker-icon-2x-violet.png',
            shadowUrl: 'img/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

        x = {loc, clear, actual, percent, markerColor}
          

        crimedct.push(x)
      }
    }

d3.json("data/Ga_Department_Locations.json").then(function (countydata) {
  {
    locations = [];


    for (i = 0; i < countydata.length; i++) {
      lat = countydata[i].Latitude;
      lng = countydata[i].Longitude;
      Income = countydata[i]["2020 Income per Capita"];
      
      if (_.findIndex(crimedct, {loc: (countydata[i]["Agency Name"])}) >= 0)
        locArea = L.marker([lat, lng], {icon: crimedct[_.findIndex(crimedct, {loc: (countydata[i]["Agency Name"])})].markerColor}).bindPopup(
          `<h2> ${countydata[i]["Agency Name"]}</h2><hr> <p>Total crimes: ${crimedct[_.findIndex(crimedct, {loc: (countydata[i]["Agency Name"])})].actual} </p>
          Solved Crimes: ${crimedct[_.findIndex(crimedct, {loc: (countydata[i]["Agency Name"])})].clear}</p><p> Percent Solved: ${crimedct[_.findIndex(crimedct, {loc: (countydata[i]["Agency Name"])})].percent}%`);
      else
        locArea = L.marker([lat, lng]).bindPopup(
          `<h2> ${countydata[i]["Agency Name"]}</h2>`);

      locations.push(locArea);
      

    }

    loclayer = L.layerGroup(locations);
  }

  d3.json("data/ID_capita.json").then(function (income) {
    ctycolor = [];
    combined = [];

    for (i = 0; i < income.length; i++) {
      var countycolor;

      if (income[i]["2020 Income per Capita"] > 70000) 
        countycolor = "#008000";
      else if (income[i]["2020 Income per Capita"] > 55000)
        countycolor = "#00FFFF";
      else if (income[i]["2020 Income per Capita"] > 37500)
        countycolor = "#ff4500";
      else 
        countycolor = "#FF0000";

      var cty = income[i]["County"];

      cty = _.toUpper(cty);
      x = { cty, countycolor };
      combined.push(x);
    }
    
    d3.json('data/crimes_county.json').then(
      function(crimelocation){

        cldict = []

        for (i = 0; i < crimelocation.data.length; i++){
          countloc = crimelocation.data[i].county_name
          countclear = crimelocation.data[i].cleared
          countactual = crimelocation.data[i].actual
          countpercent = ((countclear/countactual)*100).toFixed(2)
          z = {countloc, countclear, countactual, countpercent}

          cldict.push(z)
        
        }



    d3.json("data/GA-13-georgia-counties.json").then(function (data) {
      var geojson = topojson.feature(
        data,
        data.objects.cb_2015_georgia_county_20m
      ).features;

      
      var county = L.geoJson(geojson, {
        style: function (Feature) {
          if (_.findIndex(combined, {cty: _.toUpper(Feature.properties.NAME) + " COUNTY",}) >= 0) {
            return {
              color: "black",
              fillColor:
                combined[_.findIndex(combined, {cty: _.toUpper(Feature.properties.NAME) + " COUNTY",})].countycolor,
              fillOpacity: 0.3,
              weight: 2,
            };
          } else
            return {
              color: "black",
              fillColor: "white",
              fillOpacity: 0.3,
              weight: 2,
            };
        },
        onEachFeature: function (Feature, layer) {
          layer.on({
            mouseover: function (event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.85,
              });
            },

            mouseout: function (event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.3,
              });
            },

            click: function (event) {
              layer = event.target;
              //myMap.fitBounds(layer.getBounds());
            },
          });
       
          if (_.findIndex(cldict, {countloc: _.toUpper(Feature.properties.NAME),}) >= 0)
            layer.bindPopup(`<h2>${Feature.properties.NAME} County </h2> <hr> <p>Total Crimes: ${(cldict[(_.findIndex(cldict, {countloc: _.toUpper(Feature.properties.NAME),}))].countactual)}</p>
            <p>Solved Crimes: ${(cldict[(_.findIndex(cldict, {countloc: _.toUpper(Feature.properties.NAME),}))].countclear)}</p><p>Percent of Crimes Solved: ${(cldict[(_.findIndex(cldict, {countloc: _.toUpper(Feature.properties.NAME),}))].countpercent)}%`);
          else
            layer.bindPopup(`${Feature.properties.NAME} County <hr> `);
          
        },
      });

      createMap(county);
    });
  });
});
});
})