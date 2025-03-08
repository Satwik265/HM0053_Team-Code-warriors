document.getElementById('searchButton').addEventListener('click', function() {
    const product = document.getElementById('productInput').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (product) {
        // Check if the input is related to books
        if (product.toLowerCase().includes("book")) {
            fetch(`https://www.googleapis.com/books/v1/volumes?q=${product}`)
                .then(response => response.json())
                .then(data => {
                    if (data.items && Array.isArray(data.items)) {
                        data.items.forEach(item => {
                            const imgElement = document.createElement('img');
                            imgElement.src = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'placeholder.jpg';
                            imgElement.alt = item.volumeInfo.title;
                            imgElement.classList.add('result-image');
                            resultsDiv.appendChild(imgElement);
                        });
                    } else {
                        resultsDiv.innerHTML = '<p class="error-message">Sorry, no results found for books.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching book images:', error);
                    resultsDiv.innerHTML = '<p class="error-message">Sorry, an error occurred while fetching book images.</p>';
                });
        } else {
            // For stationery and notes, use Unsplash API
            const unsplashAccessKey = 'YOUR_UNSPLASH_API_KEY'; // Replace with your Unsplash API key
            fetch(`https://api.unsplash.com/search/photos?query=${product}&client_id=${unsplashAccessKey}`)
                .then(response => response.json())
                .then(data => {
                    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
                        data.results.forEach(item => {
                            const imgElement = document.createElement('img');
                            imgElement.src = item.urls.thumb; // Use thumbnail URL for better performance
                            imgElement.alt = item.alt_description || 'Image';
                            imgElement.classList.add('result-image');
                            resultsDiv.appendChild(imgElement);
                        });
                    } else {
                        resultsDiv.innerHTML = '<p class="error-message">Sorry, no results found for stationery or notes.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching images from Unsplash:', error);
                    resultsDiv.innerHTML = '<p class="error-message">Sorry, an error occurred while fetching images.</p>';
                });
        }
    } else {
        resultsDiv.innerHTML = '<p class="error-message">Please enter a product name.</p>';
    }
});
