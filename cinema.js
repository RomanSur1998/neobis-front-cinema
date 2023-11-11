const movie = document.querySelector(".movie");
const form = document.querySelector("form");
const search = document.querySelector(".search");
const moutnh = document.querySelector(".moutnh");
const relize_for_month = document.querySelector(".reliz");
const tops = document.querySelector(".top");
const waiting = document.querySelector(".waiting");
const block = document.querySelector(".block");
const buttons = document.querySelectorAll(".nav_button");
const API =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const SEARCH_API =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_KEY = "3d73b662-f1b3-4b82-9e6a-33a349d1d4dd";

const MOUNTH_API =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=";

const MOUNTH_RELIZE =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=";

const YEAR_RELIZE =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=";

function getParam(data) {
  if (data.films) {
    return data.films;
  } else if (data.items) {
    return data.items;
  } else {
    return data.releases;
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

getLocal();

getMovie(API);

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
  } catch (error) {
    console.log(error);
  }
}

function getLocal() {
  if (!localStorage.getItem("films")) {
    localStorage.setItem("films", JSON.stringify([]));
  }
}

function movieList(data) {
  movie.innerHTML = "";
  data.forEach((elem) => {
    let card = document.createElement("div");
    let block = document.createElement("div");
    let block_left = document.createElement("div");
    let block_right = document.createElement("div");
    let image = document.createElement("img");
    let title = document.createElement("h2");
    let icon = document.createElement("img");
    let reiting = document.createElement("h4");
    let year = document.createElement("h4");
    let genre = document.createElement("h4");

    card.className = "flex-colum movie_card";
    title.textContent = elem.nameRu;
    title.className = "title";
    image.src = elem.posterUrl;
    block.className = "movie_card_block";
    reiting.textContent = elem.rating;
    if (elem.rating) {
      reiting.className = "reiting";
    }
    block_right.className = "block_right";
    year.textContent = elem.year;
    year.className = "yers";
    genre.textContent = elem.genres[0].genre;
    icon.classList = "icon";

    icon.src = isFavorite(elem)
      ? "./assets/heart_fill.svg"
      : "./assets/heart_outline.svg";

    icon.addEventListener("click", () => {
      toggleFavorite(elem);
      icon.src = isFavorite(elem)
        ? "./assets/heart_fill.svg"
        : "./assets/heart_outline.svg";
    });

    card.appendChild(image);
    block_left.append(title, year, genre);
    block_right.append(icon, reiting);
    block.append(block_left, block_right);
    card.appendChild(block);
    movie.appendChild(card);
  });
}

function isFavorite(elem) {
  let data = JSON.parse(localStorage.getItem("films"));
  return data.findIndex((item) => item.filmId === elem.filmId) !== -1;
}

function toggleFavorite(elem) {
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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (search.value) {
    let NEW_URL = `${SEARCH_API}${search.value}`;
    getMovie(NEW_URL);
  }
});

moutnh.addEventListener("click", () => {
  let newMoutn = new Date().toLocaleString("en-US", { month: "long" });

  getMovie(`${MOUNTH_API}${new Date().getFullYear()}&month=${newMoutn}`);
});

relize_for_month.addEventListener("click", () => {
  let newMoutn = new Date().toLocaleString("en-US", { month: "long" });
  getMovie(
    `${MOUNTH_RELIZE}${new Date().getFullYear()}&month=${newMoutn}&page=1`
  );
});

tops.addEventListener("click", () => {
  getMovie(API);
});

waiting.addEventListener("click", () => {
  getMovie(`${YEAR_RELIZE}${new Date().getFullYear() + 1}&month=JANUARY`);
});

block.addEventListener("click", () => {
  let data = JSON.parse(localStorage.getItem("films"));
  movieList(data);
});
