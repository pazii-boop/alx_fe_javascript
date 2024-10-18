// Array to store quotes
const quotes = [
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

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplayDiv = document.getElementById("quoteDisplay");

  // Create quote text and category elements
  quoteDisplayDiv.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <p><em>Category: ${randomQuote.category}</em></p>
    `;
}

// Event listener for 'Show New Quote' button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

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

  // Clear the input fields after submission
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added successfully!");
}

// Event listener for 'Add Quote' button
document.getElementById("addQuoteButton").addEventListener("click", addQuote);
