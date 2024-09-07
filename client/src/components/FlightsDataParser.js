
// Function to parse and return unique cities from flights data
function parsedData(flightsData) {
    const uniqueDepartureCities = [
        ...new Set(flightsData.map(flight => ({
            cityName: flight.departureCity,
            airportName: flight.departureAirport,
            portCode: flight.departurePortCode
        })))
    ];

    const uniqueArrivalCities = [
        ...new Set(flightsData.map(flight => ({
            cityName: flight.arrivalCity,
            airportName: flight.arrivalAirport,
            portCode: flight.arrivalPortCode
        })))
    ];

    const combinedUniqueCities = [
        ...uniqueDepartureCities,
        ...uniqueArrivalCities
    ];
    
    // Remove duplicates by cityName and sort alphabetically
    const allUniqueCities = [
        ...new Map(combinedUniqueCities.map(city => [city.cityName, city])).values()
    ].sort((a, b) => a.cityName.localeCompare(b.cityName));

    return allUniqueCities;
}

export default parsedData;
