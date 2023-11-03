const movie = document.querySelector(".movie");
const form = document.querySelector("form");
const search = document.querySelector(".search");
const moutnh = document.querySelector(".moutnh");
const relize_for_month = document.querySelector(".reliz");
const tops = document.querySelector(".top");
const waiting = document.querySelector(".waiting");
const block = document.querySelector(".block");

const API =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const SEARCH_API =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_KEY = "18995958-3405-4ae8-9084-6a14dfb5cc24";

function getParam(data) {
  if (data.films) {
    return data.films;
  } else if (data.items) {
    return data.items;
  } else {
    return data.releases;
  }
}

// getMovie(API);
async function getMovie(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    movieList(getParam(data));
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function movieList(data) {
  movie.innerHTML = "";
  data.forEach((elem) => {
    let card = document.createElement("div");
    card.addEventListener("click", () => {
      Local(elem);
    });
    card.className = "movie_card";
    let image = document.createElement("img");
    let title = document.createElement("h2");
    title.textContent = elem.nameRu;
    image.src = elem.posterUrl;

    if (change(elem.filmId)) {
      card.className = "movie_card favorite";
    }
    card.appendChild(image);
    card.appendChild(title);
    movie.appendChild(card);
  });
  getMovie(API);
}
console.log(search.value);

function change(elem) {
  let data = JSON.parse(localStorage.getItem("films"));
  return data.findIndex((item) => item.filmId === elem) !== -1;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (search.value) {
    let NEW_URL = `${SEARCH_API}${search.value}`;
    getMovie(NEW_URL);
  }
});

moutnh.addEventListener("click", () => {
  let newMoutn = new Date().toLocaleString("en-US", { month: "long" });
  console.log(new Date().getFullYear());
  getMovie(
    `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${new Date().getFullYear()}&month=${newMoutn}`
  );
});

relize_for_month.addEventListener("click", () => {
  let newMoutn = new Date().toLocaleString("en-US", { month: "long" });
  getMovie(`https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=${new Date().getFullYear()}&month=${newMoutn}&page=1
`);
});
tops.addEventListener("click", () => {
  getMovie(API);
});

function Local(elem) {
  if (!localStorage.getItem("films")) {
    localStorage.setItem("films", JSON.stringify([]));
  }

  let data = JSON.parse(localStorage.getItem("films"));
  const existingFilmIndex = data.findIndex((item) => {
    if (item.filmId) {
      return item.filmId === elem.filmId;
    } else {
      return item.kinopoiskId === elem.kinopoiskId;
    }
  });

  if (existingFilmIndex !== -1) {
    data.splice(existingFilmIndex, 1);
  } else {
    data.push(elem);
  }

  localStorage.setItem("films", JSON.stringify(data));
}

waiting.addEventListener("click", () => {
  getMovie(
    `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${
      new Date().getFullYear() + 1
    }&month=JANUARY`
  );
});

block.addEventListener("click", () => {
  let data = JSON.parse(localStorage.getItem("films"));
  movieList(data);
});
