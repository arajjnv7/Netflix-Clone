const apiKey = "f06db8e407bc1bfe579b04c6a2399ba9";
const youtubeApiKey = "AIzaSyACIl6OEgZymD8s-kRXDQJABegO0JMKB5s";
const apiEndPoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const apiPaths = {
    fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id)=> `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending: `${apiEndPoint}/trending/all/day?api_key=${apiKey}`,
    searchOnYoutube: (query)=> `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}trailer&key=${youtubeApiKey} `

}
function init() {
    // alert('123')
    // fetchAndBuildMovieSection(apiPaths.fetchTrending, 'Trending Now');
    fetchAndBuildAllSections();
    fetchTrendingMovies();
}
function fetchTrendingMovies() {
    fetchAndBuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
    .then(list => {
        const randomIndex = parseInt (Math.random()* list.length);
        buildBannerSection(list[randomIndex]);
    })
    .catch (err => {
        console.error(err);
    });
}
function buildBannerSection(movie) {
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;
    const div = document.createElement('div');
    div.innerHTML = `
    <h2 class="banner_title">${movie.title}</h2>
    <p class="banner_info">Trending in Movies | Released on (${movie.release_date})</p>
    <p class="banner_overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0, 200).trim()+'...' : movie.overview}</p>
    <div class="action-buttons-cont">
        <button class="action-button"><i class="fa-solid fa-play"></i>Play</button>
        <button class="action-button"><i class="fa-solid fa-circle-info"></i>More Info</button>
    </div>`
    div.className = "banner-content container";
    bannerCont.append(div);
}


function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res  => {
        const categories = res.genres;
        if (Array.isArray(categories) && categories.length) {
            categories.forEach(category => {
                return fetchAndBuildMovieSection(apiPaths.fetchMoviesList(category.id), category.name);
            })
        }
        console.table(movies);
    })
    .catch(err =>console.error(err));
}
function fetchAndBuildMovieSection(fetchUrl, categoryName) {
    console.log(fetchUrl, categoryName);
    return fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
        // return console.table(res.results);
        const movies = res.results;
        if (Array.isArray(movies) && movies.length) {
            buildMoviesSection(movies, categoryName);
        }
        return movies;
    })
    .catch(err => console.error(err))
}

function buildMoviesSection(list, categoryName) {
    console.log(list, categoryName);
    const moviesCont = document.getElementById('movies-cont');
    const moviesListHTML = list.map(item => {
        return `
        <div class="movies-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}' )">
            <img class="movies-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
            <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>`;
    });

    const moviesSectionHTML = `
        <h2 class="movies-section-heading">${categoryName}<span class="explore-nudge"> <i class="fa-solid fa-angle-right"></i> Explore All</span></h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>
    `


    console.log(moviesListHTML);
    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = moviesSectionHTML;


    // Append HTML into Movies Container

    moviesCont.append(div);
}

function searchMovieTrailer (movieName, iframeId) {
    if(!movieName) return;
    fetch(apiPaths.searchOnYoutube(movieName))
    .then (res => res.json())
    .then (res => {
        const bestResult = res.items[0];
        const elements = document.getElementById(iframeId);
        console.log(elements, iframeId);
        const div = document.createElement('div');
        div.innerHTML = `<iframe width="245" height="150" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`
        elements.append(div);

    })
    .catch(err => console.log(err));

}

window.addEventListener('load',function() {
    init();
    // Fix Header While Scroll
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if(window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
    
})