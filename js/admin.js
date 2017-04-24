var pick_lat;
var pick_lng;
var pick_pos;
var pick_infowindow;

function pick_parks()
{
    google.maps.event.addListener(map, "rightclick", function(event) {
        pick_lat = event.latLng.lat();
        pick_lng = event.latLng.lng();
        pick_pos = new google.maps.LatLng(pick_lat ,pick_lng);
        pick_infowindow = new google.maps.InfoWindow({
            map: map,
            position: pick_pos,
            content: "Lat= " + pick_lat + "</br></br> Lng= " + pick_lng
        });
    });
}

$(document).ready(function() {
    timeout= setTimeout(pick_parks, 5000);
});

$(document).load(function() {
});