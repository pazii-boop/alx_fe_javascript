// Load existing quotes from local storage if available
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Motivation",
  },
  {
    text: "Life is 10% what happens to us and 90% how we react to it.",
    category: "Life",
  },
  {
    text: "The best way to predict the future is to invent it.",
    category: "Innovation",
  },
];

// Function to save quotes array to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote and save the last viewed quote in sessionStorage
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplayDiv = document.getElementById("quoteDisplay");

  // Clear the previous content
  quoteDisplayDiv.innerHTML = "";

  // Create paragraph elements for quote text and category
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${randomQuote.text}"`;

  const quoteCategory = document.createElement("p");
  quoteCategory.innerHTML = `<em>Category: ${randomQuote.category}</em>`;

  // Append the new content to the quoteDisplayDiv
  quoteDisplayDiv.appendChild(quoteText);
  quoteDisplayDiv.appendChild(quoteCategory);

  // Save the last viewed quote to sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// Function to display the last viewed quote when page reloads (optional sessionStorage feature)
function showLastViewedQuote() {
  const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
  if (lastViewedQuote) {
    const quoteDisplayDiv = document.getElementById("quoteDisplay");
    quoteDisplayDiv.innerHTML = `
      <p>"${lastViewedQuote.text}"</p>
      <p><em>Category: ${lastViewedQuote.category}</em></p>
    `;
  }
}

// Function to dynamically create the "Add Quote" form
function createAddQuoteForm() {
  const formDiv = document.getElementById("quoteForm");

  // Clear the form div
  formDiv.innerHTML = "";

  // Create input for new quote text
  const inputQuote = document.createElement("input");
  inputQuote.setAttribute("id", "newQuoteText");
  inputQuote.setAttribute("type", "text");
  inputQuote.setAttribute("placeholder", "Enter a new quote");

  // Create input for new quote category
  const inputCategory = document.createElement("input");
  inputCategory.setAttribute("id", "newQuoteCategory");
  inputCategory.setAttribute("type", "text");
  inputCategory.setAttribute("placeholder", "Enter quote category");

  // Create button to add new quote
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.setAttribute("id", "addQuoteButton");

  // Append inputs and button to formDiv
  formDiv.appendChild(inputQuote);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(addButton);

  // Add event listener to the button
  addButton.addEventListener("click", addQuote);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  // Validate input
  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both quote text and category!");
    return;
  }

  // Add new quote to the array
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);

  // Save updated quotes to local storage
  saveQuotes();

  // Repopulate the category dropdown
  populateCategories();

  // Clear input fields after submission
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added successfully!");
}

// Function to populate the category dropdown with unique categories
function populateCategories() {
  const categoryDropdown = document.getElementById("categoryFilter");

  // Clear existing options
  categoryDropdown.innerHTML = '<option value="All">All</option>';

  // Get unique categories using map and filter
  const categories = [...new Set(quotes.map((quote) => quote.category))];

  // Populate the dropdown
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryDropdown.appendChild(option);
  });
}

// Function to filter and display quotes by category
function filterQuotesByCategory() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteDisplayDiv = document.getElementById("quoteDisplay");

  // Clear the previous content
  quoteDisplayDiv.innerHTML = "";

  // Filter quotes based on the selected category
  const filteredQuotes =
    selectedCategory === "All"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  // Display the filtered quotes
  filteredQuotes.forEach((quote) => {
    const quoteText = document.createElement("p");
    quoteText.textContent = `"${quote.text}"`;

    const quoteCategory = document.createElement("p");
    quoteCategory.innerHTML = `<em>Category: ${quote.category}</em>`;

    quoteDisplayDiv.appendChild(quoteText);
    quoteDisplayDiv.appendChild(quoteCategory);
  });
}

// Function to export quotes as JSON
function exportQuotesAsJson() {
  const dataStr = JSON.stringify(quotes, null, 2); // Convert quotes array to JSON string
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create download link
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes(); // Save imported quotes to localStorage
    populateCategories(); // Update categories after import
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for 'Show New Quote' button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Event listener for category filter dropdown
document
  .getElementById("categoryFilter")
  .addEventListener("change", filterQuotesByCategory);

// Event listener for exporting quotes as JSON
document
  .getElementById("exportQuotes")
  .addEventListener("click", exportQuotesAsJson);

// Call the function to create the form on page load
createAddQuoteForm();

// Populate the category dropdown on page load
populateCategories();

// Optionally display the last viewed quote if available
showLastViewedQuote();
