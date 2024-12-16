// Include HTML
async function includeHTML() {
    const elements = document.querySelectorAll("[data-include]");
    for (const element of elements) {
        const file = element.getAttribute("data-include");
        try {
            const response = await fetch(file);
            if (response.ok) {
                element.innerHTML = await response.text();
            } else {
                console.error(`Error fetching ${file}: ${response.statusText}`);
                element.innerHTML = "Content not found.";
            }
        } catch (error) {
            console.error(`Error fetching ${file}: ${error}`);
            element.innerHTML = "Content not found.";
        }
    }
    console.log("includeHTML function executed");
}

// Train List Implementation
class Node {
    constructor(train) {
        this.train = train;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    add(train) {
        const newNode = new Node(train);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    searchTrain(query) {
        const results = [];
        let current = this.head;
        while (current) {
            const { trainNo, trainName } = current.train;
            if (
                trainNo.includes(query) ||
                trainName.toLowerCase().includes(query.toLowerCase())
            ) {
                results.push(current.train);
            }
            current = current.next;
        }
        return results;
    }

    displayTrains(trains = null) {
        const scheduleBody = document.getElementById("schedule-body");
        if (!scheduleBody) return; // Ensure the table exists
        scheduleBody.innerHTML = ""; // Clear existing rows
        const dataToDisplay = trains || [];
        let current = this.head;

        if (!trains) {
            while (current) {
                dataToDisplay.push(current.train);
                current = current.next;
            }
        }

        if (dataToDisplay.length === 0) {
            scheduleBody.innerHTML =
                "<tr><td colspan='6'>No trains available.</td></tr>";
        }

        dataToDisplay.forEach(
            ({ trainNo, trainName, from, to, departure, arrival }) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${trainNo}</td>
                    <td>${trainName}</td>
                    <td>${from}</td>
                    <td>${to}</td>
                    <td>${departure}</td>
                    <td>${arrival}</td>
                `;
                scheduleBody.appendChild(row);
            }
        );
    }
}

const trainList = new LinkedList();
trainList.add({
    trainNo: "12345",
    trainName: "Express",
    from: "City A",
    to: "City B",
    departure: "10:00 AM",
    arrival: "2:00 PM",
});
trainList.add({
    trainNo: "67890",
    trainName: "Intercity",
    from: "City C",
    to: "City D",
    departure: "3:00 PM",
    arrival: "8:00 PM",
});
trainList.add({
    trainNo: "24680",
    trainName: "Rapid Rail",
    from: "City E",
    to: "City F",
    departure: "6:00 AM",
    arrival: "11:00 AM",
});

// Application Initialization
document.addEventListener("DOMContentLoaded", async function () {
    await includeHTML();
    console.log("HTML content included");
    trainList.displayTrains(); // Display initial trains
    console.log("Train list displayed");

    const bookingForm = document.getElementById("booking-form");
    const confirmationSection = document.getElementById("confirmation");
    const confirmationDetails = document.getElementById("confirmation-details");
    const newBookingButton = document.getElementById("new-booking");

    // Search Button
    document.getElementById("search-btn")?.addEventListener("click", function () {
        const query = document.getElementById("search-input").value.trim();
        if (query) {
            const results = trainList.searchTrain(query);
            trainList.displayTrains(results);
        }
    });

    // Reset Button
    document.getElementById("reset-btn")?.addEventListener("click", function () {
        document.getElementById("search-input").value = "";
        trainList.displayTrains();
    });

    // Handle Form Submission
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission behavior

            // Gather form data
            const from = document.getElementById("from").value;
            const to = document.getElementById("to").value;
            const date = document.getElementById("date").value;
            const passengers = document.getElementById("passengers").value;

            // Display confirmation details
            confirmationDetails.innerHTML = `
                <strong>From:</strong> ${from} <br>
                <strong>To:</strong> ${to} <br>
                <strong>Date:</strong> ${date} <br>
                <strong>Number of Passengers:</strong> ${passengers} <br>
                <strong>Status:</strong> Confirmed
            `;

            // Show confirmation section and hide the booking form
            bookingForm.style.display = "none";
            confirmationSection.style.display = "block";
        });
    }

    // Handle "Book Another Ticket" Button
    // if (newBookingButton) {
    //     newBookingButton.addEventListener("click", function () {
    //         bookingForm.reset();
    //         bookingForm.style.display = "block";
    //         confirmationSection.style.display = "none";
    //     });
    // }

    newBookingButton.addEventListener("click", function () {
        window.location.reload(); // Reloads the page completely
    });






});
