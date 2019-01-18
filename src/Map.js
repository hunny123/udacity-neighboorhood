import React, { Component } from "react";
import ListLocations from "./ListLocations";
class Map extends Component {
  state = {
    map: {},
    center: {},
    infowindow: {},
    markers: [],
    mapMarkers: [],
    data: []
  };
  putmap = center => {
    //creating map with center
    
    return new window.google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 11
    });
  };
  createMarkerdata = data => {
    // creating markerdata with the passsed data
    let markerArray = [];
    for (var i = 0; i < data.length; i++) {
      markerArray.push({
        title: data[i].venue.name,
        location: data[i].venue.location,
        info: data[i].venue
      });
    }
    return markerArray;
  }; //removing marker when filter is apply
  removeMarkers = mapMarkers => {
    
    mapMarkers.forEach(mapMarker => {
      mapMarker.setMap(null);
    });
  };

  // creating marker on map when the data is came as well filter is apply
  createMarker = (map, markers, infowindow) => {
    

    const boundMap = this;

    let mapMarkers = [];

    markers.forEach(marker => {
      //creating marker object with the data passed through createmarkerdata

      let markerobj = new window.google.maps.Marker({
        position: marker.location,
        map: map,
        title: marker.title,
        info: marker.info,
        
      });
      mapMarkers.push(markerobj); //pushing marker object in mapmarker
       
      markerobj.addListener("click", function() {
        //adding event on marker click to open info window
        
        boundMap.createinfoWindow(markerobj, infowindow);
       
      });
    });
    this.setState({ mapMarkers: mapMarkers });
  };
  createinfoWindow = (marker, infowindow, map) => {
   //Ading Animation
    marker.setAnimation(window.google.maps.Animation.BOUNCE)
   //removing animation
       setTimeout(function(){
        
       marker.setAnimation(null)   
       },1000)    
       //creating infowindow 
    if (infowindow.marker !== marker) {
      this.fillingdata(marker, infowindow, map); //filling data to marker
    }
    
  };

  getLocation() {
    //getting your geocoordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  showPosition = position => {
    //api for locations and fetching location and data

    fetch(
      `https://api.foursquare.com/v2/venues/explore?client_id=B0HO1PIPV1LJND2VXQY4I4PZJMWM5HXRQIX4U2NMEDQRTDDA&client_secret=JBK3DFMGTEVN2DOTMDOGOQET0D02TFFDAG0J4O51KTOUC414&v=20130815&ll=${
        position.coords.latitude
      },${position.coords.longitude}&limit=10&radius=10000`
    )
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },

            data: result.response.groups[0].items,
            maplocator: result.response.groups[0].items
          });
          
          this.createMarkerdata(this.state.data);
          window.initialData = this.initialData;
          loadMapAsync(
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyBVTiKKxh5pKn9dUSGaIGKJMwOTCl-O5QI&callback=initialData"
          );
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          alert("data is not available");
        }
      );
  };
  fillingdata = (marker, infowindow, map) => {
    
    infowindow.marker = marker;

    infowindow.setContent(
      `<div><h4><img src="${marker.info.categories[0].icon.prefix}bg_64${marker.info.categories[0].icon.suffix}"alt="${marker.info.categories[0].name} image"> Name:${marker.info.name}</h4><h5>Category:${
        marker.info.categories[0].name
      }</h5><p><b>Address:</b>${marker.info.location.address}</div>`
    );
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener("closeclick", function() {
      infowindow.marker = null;
    });
  };
  initialData = () => {
    //callback function when script is loaded

    let map = this.putmap(this.state.center);

    let infowindow = new window.google.maps.InfoWindow({ maxWidth: 300 });
    this.createMarker(map, this.createMarkerdata(this.state.data), infowindow);
    this.setState({
      map: map,
      markers: this.createMarkerdata(this.state.data),
      infowindow: infowindow
    });
  };

  componentDidMount() {
    //calling geoloaction for fetching location according to coordinate of current location
    this.getLocation();
  }
  render() {
    const { map, markers, mapMarkers, infowindow } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-4 bg-light mr-1 mt-2">
            <nav className="navbar bg-dark navbar-dark text-white navbar-expand-md ">
              <button
                className="navbar-toggler "
                type="button"
                data-toggle="collapse"
                data-target="#collapsibleNavbar"
              >
                <span className="navbar-toggler-icon text-white " />
              </button>
              <div className="collapse navbar-collapse" id="collapsibleNavbar">
                <ListLocations
                  map={map}
                  infowindow={infowindow}
                  markers={markers}
                  mapMarkers={mapMarkers}
                  createMarker={this.createMarker}
                  removeMarkers={this.removeMarkers}
                  createinfoWindow={this.createinfoWindow}
                />
              </div>
            </nav>
          </div>

          <div id="map" className="map col-lg-7 mt-2 pb-4" />
        </div>
      </div>
    );
  }
}

export default Map;

function loadMapAsync(src) {
  //function for loadscriptasync
  var s = document.createElement("script");

  s.async = true;
  s.src = src;
  s.onerror = () => {
    alert("Google Map API can not be loaded.");
  };
  var x = document.getElementsByTagName("script")[0];
  x.parentNode.insertBefore(s, x);
}
