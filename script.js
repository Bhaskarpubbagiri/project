// Sample bus data with added times
const buses = [
    { id: 1, number: "120A", source: "Hyderabad", destination: "Secunderabad", startTime: "09:00", endTime: "10:00" },
    { id: 2, number: "220B", source: "Hyderabad", destination: "Gachibowli", startTime: "11:00", endTime: "12:00" },
    { id: 3, number: "330C", source: "Hyderabad", destination: "Kukatpally", startTime: "13:00", endTime: "14:00" },
    { id: 4, number: "440D", source: "Hyderabad", destination: "Gachibowli", startTime: "14:30", endTime: "15:30" },
    { id: 5, number: "550E", source: "Hyderabad", destination: "Secunderabad", startTime: "17:00", endTime: "18:00" },
];

// Store the count of requests for each source-destination pair
let requestCounts = {};

// Function to check if bus start time is within the next 2 hours
function isBusAvailableInNextTwoHours(busStartTime) {
    const currentTime = new Date();
    const currentTimePlus2Hours = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);

    const [hours, minutes] = busStartTime.split(':');
    const busStartDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), hours, minutes);

    return busStartDate > currentTime && busStartDate <= currentTimePlus2Hours;
}

// Function to search for buses
function searchBuses() {
    const source = document.getElementById('source').value.toLowerCase();
    const destination = document.getElementById('destination').value.toLowerCase();

    const filteredBuses = buses.filter(bus => 
        bus.source.toLowerCase() === source && 
        bus.destination.toLowerCase() === destination
    );

    const busList = document.getElementById('busList');
    busList.innerHTML = ""; // Clear previous results

    const nextTwoHoursBuses = filteredBuses.filter(bus => 
        isBusAvailableInNextTwoHours(bus.startTime)
    );

    if (filteredBuses.length > 0) {
        const allBusesDiv = document.createElement('div');
        allBusesDiv.className = 'bus-item';
        allBusesDiv.innerHTML = `
            <h3>All Available Buses</h3>
            ${filteredBuses.map(bus => `
                <div>
                    <p>Bus Number: ${bus.number}</p>
                    <p>Start Time: ${bus.startTime}</p>
                    <p>End Time: ${bus.endTime}</p>
                </div>
            `).join('')}
        `;
        busList.appendChild(allBusesDiv);

        if (nextTwoHoursBuses.length > 0) {
            const nextTwoHoursDiv = document.createElement('div');
            nextTwoHoursDiv.className = 'bus-item';
            nextTwoHoursDiv.innerHTML = `
                <h3>Next Available Buses (Within 2 Hours)</h3>
                ${nextTwoHoursBuses.map(bus => `
                    <div>
                        <p>Bus Number: ${bus.number}</p>
                        <p>Start Time: ${bus.startTime}</p>
                        <p>End Time: ${bus.endTime}</p>
                    </div>
                `).join('')}
            `;
            busList.appendChild(nextTwoHoursDiv);
        } else {
            document.getElementById('requestModule').style.display = 'block';
            document.getElementById('requestInfo').innerText = `No buses available within the next 2 hours. You can request a bus.`;
        }
    } else {
        document.getElementById('requestModule').style.display = 'block';
        document.getElementById('requestInfo').innerText = `No buses found for the specified route. You can request a bus.`;
    }
}

// Function to request a bus
function requestBus() {
    const source = document.getElementById('source').value.toLowerCase();
    const destination = document.getElementById('destination').value.toLowerCase();
    const atTheTime = document.getElementById('atTheTime').value;

    if (!atTheTime) {
        alert('Please select a preferred time to request a bus.');
        return;
    }

    // Increment request count for the source-destination pair
    const requestKey = `${source}-${destination}`;
    requestCounts[requestKey] = requestCounts[requestKey] ? requestCounts[requestKey] + 1 : 1;

    // Provide feedback on bus request submission
    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.classList.add('visible');
    feedbackDiv.innerHTML = `<p>Your request for a bus from ${source} to ${destination} at ${atTheTime} has been submitted.</p>`;

    // Display the count of passengers requesting a bus
    document.getElementById('requestInfo').innerText = `Number of passengers requesting a bus from ${source} to ${destination}: ${requestCounts[requestKey]}`;

    // Hide the feedback after 5 seconds
    setTimeout(() => feedbackDiv.classList.remove('visible'), 5000);
}

// Attach event listener to the search button
document.getElementById('searchButton').addEventListener('click', searchBuses);
