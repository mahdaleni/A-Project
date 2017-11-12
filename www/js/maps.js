var map;
    markers = [];
    var PointsRef = new Firebase('https://mapsomething.firebaseio.com/points');
    var LinesRef = new Firebase('https://mapsomething.firebaseio.com/lines');
    var PolygonsRef = new Firebase('https://mapsomething.firebaseio.com/polygons');
    var MapRef = new Firebase('https://mapsomething.firebaseio.com/mapData');
    var CenterRef = new Firebase('https://mapsomething.firebaseio.com/mapData/centerLatLng');
    var ZoomRef = new Firebase('https://mapsomething.firebaseio.com/mapData/mapZoom');
    
    PointsRef.on('child_added', function(snapshot) {
      var location = new google.maps.LatLng(snapshot.val().pointLatLng.Lat, snapshot.val().pointLatLng.Lng);
      var marker = new google.maps.Marker({
        position: location, 
        map: map,
        key: snapshot.key()
      });





//Pan Back to Marker
google.maps.event.addListener(marker,'click',function() {
  var pos = map.getZoom();
  map.setZoom(19);
  map.setCenter(marker.getPosition());
  window.setTimeout(function() {map.setZoom(pos);},19000);
});





    
       

      markers.push(marker);
      console.log(typeof marker);
      console.log(marker);
    });
    
    PointsRef.on('child_removed', function(snapshot) {
      for (var i = 0; i < markers.length; i++) {
        if (markers[i].key == snapshot.key()) {
          markers[i].setMap(null);
        }
      }
    });
    
    CenterRef.on('value', function(snapshot) {
      var center = new google.maps.LatLng(snapshot.val().Lat, snapshot.val().Lng);
      //if (map.getCenter() != center) {
        map.setCenter(center);
      //}
    });
    
    ZoomRef.on('value', function(snapshot) {
      var zoom = snapshot.val();
      if (map.getZoom() != zoom) {
        map.setZoom(zoom);
        console.log(zoom);
      }
    });
        
    function initialize() {
      var mapOptions = {
        disableDefaultUI: false,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById("map"),mapOptions);
      google.maps.event.addListener(map, 'click', function(event) {
        if (document.getElementById('radPoint').checked && document.getElementById('radDraw').checked) {
          var jsonVariable = {
            pointLatLng: {
              Lat: event.latLng.lat(),
              Lng: event.latLng.lng()
            }
          }
          PointsRef.push(jsonVariable);
        } else if (document.getElementById('radLine').checked) {
          console.log('lnclick');
        } else if (document.getElementById('radPolygon').checked) {
          console.log('polyclick');
        }
        
        
      });
google.maps.event.addListener(map, 'click', function(event) {
  placeMarker(map, event.latLng);
  });
function placeMarker(map, location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  var infowindow = new google.maps.InfoWindow({
    content: 'Latitude: ' + location.lat() +
    '<br>Longitude: ' + location.lng()
  });
  infowindow.open(map,marker);
}
      
     
      
      google.maps.event.addListener(map, 'zoom_changed', function() {
        var center = map.getCenter();
        var zoom = map.getZoom();
        var jsonVariable = {
          mapZoom: zoom
        }
        MapRef.update(jsonVariable);
      });
      
    }
    
    function eraseAll() {
      PointsRef.remove();
    }
    
    google.maps.event.addDomListener(window, 'load', initialize);


//reload

function myFunction() {
    location.reload();
}