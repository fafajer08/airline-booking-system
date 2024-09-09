// FlightsDataParser.js

// Function to parse and return unique cities from flights data
function parseData(flightsData) {
    // Collect unique departure cities
    console.log(`parser: ${flightsData[0][0]}`)
    const uniqueDepartureCities = flightsData.map(flight => ({
        cityName: flight.departureAirportCity,
        airportName: flight.departureAirport,
        portCode: flight.departureAirportCode
    }));

    // Collect unique destination cities
    const uniqueArrivalCities = flightsData.map(flight => ({
        cityName: flight.destinationAirportCity,
        airportName: flight.destinationAirport,
        portCode: flight.destinationAirportCode
    }));

    // Combine departure and destination cities
    const combinedUniqueCities = [...uniqueDepartureCities, ...uniqueArrivalCities];

    // Remove duplicates by `portCode` using `Map`
    const uniqueCitiesMap = new Map(combinedUniqueCities.map(city => [city.portCode, city]));

    // Convert MapIterator to Array
    const allUniqueCities = Array.from(uniqueCitiesMap.values());

    // Sort cities alphabetically by `cityName`
    const sortedUniqueCities = allUniqueCities.sort((a, b) => a.cityName.localeCompare(b.cityName));

    return sortedUniqueCities;
}

export default parseData;
