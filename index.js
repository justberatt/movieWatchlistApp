const inputField = document.querySelector('#search-movie')
const searchBtn = document.querySelector('#search-btn')
const moviesList = document.querySelector('#search-movies-list')

document.addEventListener('click', (e) => {
    if(e.target.dataset.add)
        handleAddToWatchlistClick(e.target.dataset.add)
    if (e.target.dataset.delete)
        handleRmvFromWatchlistClick(e.target.dataset.delete)
})

const watchlistContainer = document.querySelector('#watchlist')
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
if (watchlist) {
    if (watchlistContainer) {
        let html = '' 
        html = watchlist.map(film => `
                            <li class="movie-card" id="${film.id}">
                                <div class="movie-poster">
                                    <img src="${film.poster}">
                                </div>
                                <div class="movie-info">
                                    <div class="movie-header">
                                        <h2 class="movie-title">${film.title}</h2>
                                        <svg width="15" height="15" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.78671 1.19529C6.01122 0.504306 6.98878 0.504305 7.21329 1.19529L8.01547 3.66413C8.11588 3.97315 8.40384 4.18237 8.72876 4.18237H11.3247C12.0512 4.18237 12.3533 5.11208 11.7655 5.53913L9.66537 7.06497C9.40251 7.25595 9.29251 7.59447 9.39292 7.90349L10.1951 10.3723C10.4196 11.0633 9.62875 11.6379 9.04097 11.2109L6.94084 9.68503C6.67797 9.49405 6.32203 9.49405 6.05916 9.68503L3.95903 11.2109C3.37125 11.6379 2.58039 11.0633 2.8049 10.3723L3.60708 7.90349C3.70749 7.59448 3.59749 7.25595 3.33463 7.06497L1.2345 5.53914C0.646715 5.11208 0.948796 4.18237 1.67534 4.18237H4.27124C4.59616 4.18237 4.88412 3.97315 4.98453 3.66414L5.78671 1.19529Z" fill="#FEC654"/>
                                        </svg>
                                        <p class="movie-rating">${film.rating}</p>
                                    </div>
                                    <div class="movie-category">
                                        <p class="movie-runtime">${film.runtime}</p>
                                        <p class="movie-genre">${film.genre}</p>
                                        <button class="remove-from-watchlist-btn" data-delete="${film.id}">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5 7C4.44772 7 4 7.44772 4 8C4 8.55228 4.44772 9 5 9H11C11.5523 9 12 8.55229 12 8C12 7.44772 11.5523 7 11 7H5Z" fill="white"/>
                                            </svg>
                                            Watchlist
                                        </button>
                                    </div>
                                    <p class="movie-plot">${film.plot}</p>
                                </div>
                            </li>
                        `).join('')
                        watchlistContainer.innerHTML = html
                    }
}

const handleRmvFromWatchlistClick = (filmID) => {
    const filmToDelete = document.querySelector(`#${filmID}`)
    watchlistContainer.removeChild(filmToDelete)
    watchlist.forEach((movie, index) => {
        if (movie.id === filmID)
            watchlist.splice(index, 1)
        if (watchlist.length === 0) {
            localStorage.removeItem("watchlist");
        } else {
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
        }
    })
}

// Handle adding a movie to the watchlist
const handleAddToWatchlistClick = (filmID) => {
    fetch(`http://www.omdbapi.com/?i=${filmID}&apikey=d9160841`)
        .then(res => res.json())
        .then(data => {
            // Check if the movie is already in the watchlist
            if (watchlist.some(movie => movie.id === data.imdbID)) {
                alert('This movie is already in your watchlist!');
                return;
            }
                        
            // Create a movie object and add it to the watchlist
            const movie = {
                id: data.imdbID,
                title: data.Title,
                rating: data.imdbRating,
                runtime: data.Runtime,
                genre: data.Genre,
                poster: data.Poster,
                plot: data.Plot,
            };

            watchlist.push(movie);
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            const button = document.querySelector(`[data-add="${filmID}"]`);
            if (button) {
                button.textContent = "Added!";
                button.style.color = "lightgreen"
                button.disabled = true;
            }
        })
        .catch(err => console.error('Error fetching movie data:', err));
};

const getMovies = () => {
    const query = inputField.value.trim();
    if (!query) {
        const search = document.querySelector('#search-input__container')
        search.classList.add('shake')
        setTimeout(() => search.classList.remove('shake'), 3000)
        return;
    }
    fetch(`http://www.omdbapi.com/?s=${inputField.value}&apikey=d9160841`)
        .then(res => res.json())
        .then(data => {
            render(data)
        })
}

const render = (data) => {
    let html = ''
    data.Search.forEach(film => {
        fetch(`http://www.omdbapi.com/?i=${film.imdbID}&apikey=d9160841`)
            .then(res => res.json())
            .then(data => {
                html += `
                    <li class="movie-card" id="${data.imdbID}">
                        <div class="movie-poster">
                            <img src="${data.Poster}">
                        </div>
                        <div class="movie-info">
                            <div class="movie-header">
                                <h2 class="movie-title">${data.Title}</h2>
                                <svg width="15" height="15" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.78671 1.19529C6.01122 0.504306 6.98878 0.504305 7.21329 1.19529L8.01547 3.66413C8.11588 3.97315 8.40384 4.18237 8.72876 4.18237H11.3247C12.0512 4.18237 12.3533 5.11208 11.7655 5.53913L9.66537 7.06497C9.40251 7.25595 9.29251 7.59447 9.39292 7.90349L10.1951 10.3723C10.4196 11.0633 9.62875 11.6379 9.04097 11.2109L6.94084 9.68503C6.67797 9.49405 6.32203 9.49405 6.05916 9.68503L3.95903 11.2109C3.37125 11.6379 2.58039 11.0633 2.8049 10.3723L3.60708 7.90349C3.70749 7.59448 3.59749 7.25595 3.33463 7.06497L1.2345 5.53914C0.646715 5.11208 0.948796 4.18237 1.67534 4.18237H4.27124C4.59616 4.18237 4.88412 3.97315 4.98453 3.66414L5.78671 1.19529Z" fill="#FEC654"/>
                                </svg>
                                <p class="movie-rating">${data.imdbRating}</p>
                            </div>
                            <div class="movie-category">
                                <p class="movie-runtime">${data.Runtime}</p>
                                <p class="movie-genre">${data.Genre}</p>
                                <button class="add-to-watchlist-btn" data-add="${data.imdbID}">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z" fill="white"/>
                                    </svg>
                                    Watchlist
                                </button>
                            </div>
                            <p class="movie-plot">${data.Plot}</p>
                        </div>
                    </li>
                `  
                moviesList.innerHTML = html
            })
    })
}

if (inputField && searchBtn) {
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            getMovies();
        }
    });
    searchBtn.addEventListener('click', getMovies);
}