// Initialize the quotes array (fetch from local storage if available)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available. Please add some quotes!");
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplayDiv = document.getElementById("quoteDisplay");
  quoteDisplayDiv.innerHTML = `
        <p>"${randomQuote.text}"</p>
        <p><em>Category: ${randomQuote.category}</em></p>
    `;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// Function to create and display the form for adding new quotes
function createAddQuoteForm() {
  const formDiv = document.getElementById("quoteForm");
  formDiv.innerHTML = "";

  const inputQuote = document.createElement("input");
  inputQuote.setAttribute("id", "newQuoteText");
  inputQuote.setAttribute("type", "text");
  inputQuote.setAttribute("placeholder", "Enter a new quote");

  const inputCategory = document.createElement("input");
  inputCategory.setAttribute("id", "newQuoteCategory");
  inputCategory.setAttribute("type", "text");
  inputCategory.setAttribute("placeholder", "Enter quote category");

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formDiv.appendChild(inputQuote);
  formDiv.appendChild(inputCategory);
  formDiv.appendChild(addButton);
}

// Function to add a new quote from the form
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both quote text and category!");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  alert("New quote added successfully!");

  // Simulate posting the new quote to a server
  postQuoteToServer(newQuote);
}

// Function to populate the category dropdown based on available categories
function populateCategories() {
  const categoryDropdown = document.getElementById("categoryFilter");
  categoryDropdown.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map((quote) => quote.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryDropdown.appendChild(option);
  });
}

// Function to filter quotes by selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    alert(`No quotes available for category "${selectedCategory}"`);
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  const quoteDisplayDiv = document.getElementById("quoteDisplay");
  quoteDisplayDiv.innerHTML = `
        <p>"${randomQuote.text}"</p>
        <p><em>Category: ${randomQuote.category}</em></p>
    `;
}

// Function to export quotes as a JSON file
function exportQuotesAsJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to post a new quote to the simulated server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });

    if (!response.ok) {
      throw new Error("Failed to post quote to server");
    }

    const serverResponse = await response.json();
    console.log("Quote posted to server:", serverResponse);
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

// Simulate fetching quotes from a server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();

    // Simulate fetching only relevant data
    const parsedQuotes = serverQuotes.slice(0, 5).map((item) => ({
      text: item.title,
      category: "Server", // Assign a default category
    }));

    syncQuotes(parsedQuotes);
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Sync quotes between local storage and server
function syncQuotes(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Conflict resolution: Assume server data takes precedence
  const mergedQuotes = [
    ...serverQuotes,
    ...localQuotes.filter(
      (localQuote) =>
        !serverQuotes.some(
          (serverQuote) => serverQuote.text === localQuote.text
        )
    ),
  ];

  // Update local storage with the merged quotes
  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));

  // Notify user that data has been synced
  alert("Quotes have been synced with the server!");

  quotes = mergedQuotes;
  populateCategories();
  showRandomQuote();
}

// Periodically fetch quotes from the server every 30 seconds
setInterval(fetchQuotesFromServer, 30000);

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document
  .getElementById("exportQuotes")
  .addEventListener("click", exportQuotesAsJson);

// Initial setup
createAddQuoteForm();
populateCategories();

// Show last viewed quote from session storage (optional)
const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
if (lastViewedQuote) {
  const quoteDisplayDiv = document.getElementById("quoteDisplay");
  quoteDisplayDiv.innerHTML = `
        <p>"${lastViewedQuote.text}"</p>
        <p><em>Category: ${lastViewedQuote.category}</em></p>
    `;
}
