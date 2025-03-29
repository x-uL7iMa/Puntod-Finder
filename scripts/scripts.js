// Function to handle the search functionality
function searchSection() {
    // Get the user input and convert it to lowercase
    const input = document.getElementById('searchInput').value.trim().toLowerCase();
    const mapContainer = document.getElementById('mapContainer'); // Map container element
    const mapMessage = document.getElementById('mapMessage'); // Map message element

    // Predefined sections and their corresponding messages
    const sections = {
        "section 1": "Map for Section 1: [Location details here]",
        "section 2": "Map for Section 2: [Location details here]"
    };

    // Check if the input matches a predefined section
    if (sections[input]) {
        mapMessage.textContent = sections[input]; // Display the corresponding message
        mapContainer.style.display = 'flex'; // Show the map container
    } else {
        mapMessage.textContent = "Section not found. Please enter a valid section."; // Error message
        mapContainer.style.display = 'flex'; // Show the map container
    }
}

// Function to toggle the visibility of the forgot form
function toggleForgotForm() {
    const form = document.getElementById('forgotForm'); // Forgot form element
    const searchBar = document.getElementById('searchBar'); // Search bar element

    // Toggle the display of the forgot form and search bar
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'flex'; // Show the forgot form
        searchBar.style.display = 'none'; // Hide the search bar
    } else {
        form.style.display = 'none'; // Hide the forgot form
        searchBar.style.display = 'block'; // Show the search bar
    }
}

// Function to handle the submission of the forgot form
function submitForgotForm() {
    alert("Your request has been submitted."); // Display a confirmation alert

    // Hide the forgot form and show the search bar
    document.getElementById('forgotForm').style.display = 'none';
    document.getElementById('searchBar').style.display = 'block';
}