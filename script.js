// getting places from APIs
function loadPlaces(position) {
    const params = {
        radius: 300, // search places not farther than this value (in meters)
        limit: 30, // number of maximum places to fetch
    };

    // Your Foursquare API Key
    const foursquareApiKey = 'fsq3CnlVFCvVjRoymILUUWxDNGSn/06E5DGB5GhlNxo5krA='; // Ganti dengan API Key Foursquare v3 kamu

    // Endpoint Foursquare API v3
    const endpoint = `https://api.foursquare.com/v3/places/search?ll=${position.latitude},${position.longitude}&radius=${params.radius}&limit=${params.limit}`;

    // Fetch data from the Foursquare API v3
    return fetch(endpoint, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': foursquareApiKey
        }
    })
    .then((res) => res.json())
    .then((resp) => {
        return resp.results; // Sesuaikan dengan struktur respons terbaru API v3
    })
    .catch((err) => {
        console.error('Error with places API', err);
    });
}

window.onload = () => {
    const scene = document.querySelector('a-scene');

    // Get current user location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            loadPlaces(position.coords)
                .then((places) => {
                    places.forEach((place) => {
                        const latitude = place.geocodes.main.latitude;
                        const longitude = place.geocodes.main.longitude;

                        // Create a link for each place
                        const placeText = document.createElement('a-link');
                        placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                        placeText.setAttribute('title', place.name);
                        placeText.setAttribute('scale', '15 15 15');
                        
                        placeText.addEventListener('loaded', () => {
                            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                        });

                        scene.appendChild(placeText);
                    });
                });
        },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
