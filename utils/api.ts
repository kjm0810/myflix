const API_KEY = 'c6ac7eb452033ca3ad7e243a5d0a8e7a';
const BASE_URL = 'https://api.themoviedb.org/3';


const tmdbApi = async (option: apiOption) => {
    const res = await fetch(`${BASE_URL}/${option.url}?api_key=${API_KEY}&language=${option.language === '' ? 'ko-KR' : option.language}`);

    const data = res.json();

    return data
}

const movie = (option: apiOption) => {
    console.log(API_KEY);
    console.log(tmdbApi(option))
}

export {movie};