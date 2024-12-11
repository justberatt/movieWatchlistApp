// me leshu event listener edhe per ne momentin 
//qe fillon me shkrujt input edhe kur tklikohet
// butoni. 

const inputField = document.querySelector('#search-movie')
const searchBtn = document.querySelector('#search-btn')
const movieList = document.querySelector('#movies-list')

const getMovies = async () => {
    const res = await fetch(`http://www.omdbapi.com/?s=${inputField.value}&apikey=d9160841&`)
    const data = await res.json()
    console.log(data.Search)
    let html = ''
    data.Search.forEach(film => { 
        html += `
            <div class="movie-poster">
                <img src="${film.Poster}">
            </div>
            <div class="movie-info">
                <h2 class="movie-title">${film.Title}</h2>
                <p class="movie-rating"></p>
                <p class="movie-duration"></p>
                <p class="movie-genre"></p>
                <p class="movie-description"></p>
            </div>
        `  
    })
    movieList.innerHTML = html
}

inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter')
        getMovies()
})
searchBtn.addEventListener('click', getMovies)