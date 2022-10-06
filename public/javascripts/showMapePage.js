mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 9, // starting zoom
projection: 'globe' // display the map as a 3D globe
});
map.addControl(new mapboxgl.NavigationControl(),'bottom-right')
map.on('style.load', () => {
map.setFog({}); // Set the default atmosphere style
});

 new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(new mapboxgl.Popup()
.setHTML(`<h3>${campground.title}</h3> <p>${campground.location}</p>`))
.addTo(map);
