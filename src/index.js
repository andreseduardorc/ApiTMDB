console.log('hola mundo')

const api = axios.create({
    baseURL:'https://api.themoviedb.org/3',
    headers :{
        'Content-Type':'application/json;charset=utf-8',
    },
    params:{
        'api_key': API_KEY,

    },
})






async function getCategoriesPreview (){
    const { data} = await api('genre/movie/list')
    

    const categories = data.genres;

    createCategories(categories, categoriesPreviewList)
   
}


async function getMoviesByCategory (id){
    const {data} = await api('discover/movie',{
        params: {
            with_genres: id,

        },
    })
    const movies = data.results;

    createMovie(movies, genericSection, true)
}





function createMovie(
    movies,
    container, 
    {lazyLoad = true, clean = false,
    } ={}

    ){
    if (clean){
       container.innerHTML = ''; 
    } 
    
    movies.forEach(movie =>{
        

        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container')
        movieContainer.addEventListener('click', ()=>{
            location.hash ='#movie='+ movie.id;
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title );
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300/'+ movie.poster_path,
            );
            movieImg.addEventListener('error',()=>{
                movieImg.setAttribute(
                    'src',
                    'https://img.freepik.com/vector-gratis/ups-error-404-ilustracion-concepto-robot-roto_114360-5529.jpg?w=740&t=st=1677552405~exp=1677553005~hmac=b0299b382913fac9da87a272f64b900003214df9f4c10d6e11c1f8ddeaa01515'
                    
            )
        })



        if (lazyLoad){
            lazyLoader.observe(movieImg)
        }
        
        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer)

    })
}

function createCategories (categories, container){
    container.innerHTML= '';

    categories.forEach (category =>{
     

        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container')

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id','id'+ category.id );
        categoryTitle.addEventListener('click', ()=>{
            location.hash =`#category=${category.id}-${category.name}`
        })
        const categoryTitleText = document.createTextNode(category.name);
        categoryTitle.appendChild(categoryTitleText)
        categoryContainer.appendChild(categoryTitle)
        container.appendChild(categoryContainer)

       
    })
}


async function getMoviesBySearch (query){
    const {data} = await api('search/movie',{
        params: {
           query,

        },
    })
    const movies = data.results;

    createMovie(movies, genericSection)
}


async function getTrendingMovies (){
    const {data} = await api('trending/movie/day')
    const movies = data.results;

    createMovie(
    movies, 
    genericSection, 
    {lazyLoad: false, clean: true});

    // const btnLoadMore = document.createElement('button')
    // btnLoadMore.innerHTML ='cargar mas'
    // btnLoadMore.addEventListener('click', getPaginatedTrending)
    // genericSection.appendChild(btnLoadMore)
 
}

async function getTrendingMoviesPreview (){
    const {data} = await api('trending/movie/day')
    const movies = data.results;

    createMovie(movies, trendingMoviesPreviewList,{lazyLoad: false, clean: true});
}


async function getPaginatedTrending(){
    const { scrollTop, 
            clientHeight, 
            scrollHeight} = 
            document.documentElement;

   const scrollIsBotton = scrollTop + clientHeight >= scrollHeight -15
   
   if (scrollIsBotton){
    page++
    const {data} = await api('trending/movie/day',{
        params: {
            page,
        },
    })
    const movies = data.results;
    createMovie(
    movies, 
    genericSection, 
    {lazyLoad: true, clean: false});


   }

   

    // const btnLoadMore = document.createElement('button')
    // btnLoadMore.innerHTML ='cargar mas'
    // btnLoadMore.addEventListener('click', getPaginatedTrending)
    // genericSection.appendChild(btnLoadMore)

}

async function getMovieById (id){
    const {data : movie} = await api('movie/' + id)

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500'+ movie.poster_path;
    headerSection.style.background = `
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
        ),
    url(${movieImgUrl})`

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList)
    getRelatedMoviesById(id)
    
}


  async function getRelatedMoviesById(id){
    const {data} = await api(`movie/${id}/recommendations`)
    const relatedMovies= data.results;

    createMovie(relatedMovies, relatedMoviesContainer)

  }
//utilidades //

const lazyLoader = new IntersectionObserver((entries)=>{
    entries.forEach ((entry)=>{
     if(entry.isIntersecting){
      const url = entry.target.getAttribute('data-img')
      entry.target.setAttribute('src',url)
      }
    })
})
