
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'caf28887c92441cdb7ddd93487fd8db4';
    const categorySelect = document.getElementById('category');
    const sourceSelect = document.getElementById('source');
    const newsList = document.getElementById('newsList');

    // Fetch sources and populate the source dropdown
    fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            data.sources.forEach(source => {
                const option = document.createElement('option');
                option.value = source.id;
                option.textContent = source.name;
                sourceSelect.appendChild(option);
            });
        });

    // Fetch and display news articles for Canada based on user filters
    function fetchNews() {
        const selectedCategory = categorySelect.value;
        const selectedSource = sourceSelect.value;

        let apiUrl = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&country=ca`;

        if (selectedCategory) {
            apiUrl += `&category=${selectedCategory}`;
        }

        if (selectedSource) {
            apiUrl += `&sources=${selectedSource}`;
        }

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Filter out removed articles and display the remaining news articles in the UI
                const articles = data.articles.filter(article => !article.title.includes('[Removed]'));
                newsList.innerHTML = '';

                articles.forEach(article => {
                    const articleDiv = document.createElement('div');
                    articleDiv.className = 'news-card';

                    articleDiv.innerHTML = `
                        <h2>${article.title || ''}</h2>
                        ${article.urlToImage ? `<img src="${article.urlToImage}" alt="Article Image">` : `<img src="./assets/placeholder-image-url.jpg" alt="Placeholder Image">`}
                        <p>${article.description || ''}</p>
                        ${article.url ? `<a href="${article.url}" target="_blank">Read more</a>` : ''}
                    `;
                    newsList.appendChild(articleDiv);
                });
            });
    }

    // Event listeners for user interaction
    categorySelect.addEventListener('change', fetchNews);
    sourceSelect.addEventListener('change', fetchNews);

    // Initial fetch when the page loads
    fetchNews();
});





const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/register', (req, res) => {
    const email = req.body.email;

    // Basic email validation
    if (isValidEmail(email)) {
        // Save the email to a file, database, or perform any desired action
        const file = 'registered_emails.txt';
        fs.appendFileSync(file, email + '\n');

        // Optionally, you can send a response or redirect the user
        res.send('Thank you for registering!');
    } else {
        // Handle invalid email address
        res.status(400).send('Invalid email address.');
    }
});

function isValidEmail(email) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
