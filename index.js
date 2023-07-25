const form = document.querySelector(".js-search");
const list = document.querySelector(".js-list");
const button = document.querySelector("button");
const langEl = document.querySelector(".js-lang");
const placeholder = document.querySelector("input[placeholder]");
const forecast = document.querySelector(".forecast");

let lang = "en";
form.addEventListener("submit", onFormSubmit);
langEl.addEventListener("click", onLangClick);

function getWeather(city, day, text) {
  const BASE_URL = "http://api.weatherapi.com/v1";
  const API_KEY = "5158327e8cd74e2e84d110141231707";
  return fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${day}&lang=${text}`
  ).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res.json();
  });
}

function onLangClick(e) {
  lang = e.target.value;
  const placeholder = e.target.form[1].attributes.placeholder;

  if (lang === "uk") {
    button.textContent = "Пошук";
    placeholder.textContent = "Введіть місто";
    forecast.textContent = "Прогноз погоди";
    list.innerHTML = ""
  } else {
    button.textContent = "GO";
    placeholder.textContent = "Enter the city";
    forecast.textContent = "Weather forecast";
    list.innerHTML = ""
  }
}

function onFormSubmit(e) {
  e.preventDefault();
  const { query, days, lang } = e.currentTarget.elements;

  getWeather(query.value, days.value, lang.value)
    .then((resp) => (list.innerHTML = createMarkup(resp.forecast.forecastday)))
    .catch((err) => (list.innerHTML = createErrorMarkup()));
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        date,
        day: {
          avgtemp_c,
          condition: { icon, text },
        },
      }) => `<li>
    <h2>${date}</h2>
        <img src="${icon}" alt="${text}">
        <p>${text}</p>
        <h3>${Math.round(avgtemp_c)} °C</h3>
    </li>`
    )
    .join("");
}

function createErrorMarkup() {
  if (lang === "uk") {
    return `<li>Помилка</li>`;
  }
  return `<li>Error</li>`;
}
