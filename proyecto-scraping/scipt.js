const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        const products = await searchProducts(searchTerm);
        displayResults(products);
    }
});

async function searchProducts(searchTerm) {
    // Implementar la lógica de web scraping aquí
    // Por ejemplo, utilizando la biblioteca Cheerio
    const axios = require('axios');
    const cheerio = require('cheerio');

    const url = `https://www.supermercado.com/search?q=${searchTerm}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const products = [];
    $('div.product').each((index, element) => {
        const title = $(element).find('h2.title').text();
        const price = $(element).find('span.price').text();
        const image = $(element).find('img.image').attr('src');
        const characteristics = $(element).find('ul.characteristics').text();

        products.push({
            title,
            price,
            image,
            characteristics
        });
    });

    return products;
}

function displayResults(products) {
    const resultsHtml = products.map((product) => {
        return `
            <div class="product">
                <h2>${product.title}</h2>
                <p>Precio: ${product.price}</p>
                <img src="${product.image}" alt="${product.title}">
                <p>Características: ${product.characteristics}</p>
            </div>
        `;
    }).join('');

    resultsContainer.innerHTML = resultsHtml;
}