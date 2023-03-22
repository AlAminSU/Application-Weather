const UI = {
  loadSelectors() {
    const cityElm = document.querySelector("#city");
    const cityInfoElm = document.querySelector("#w-city");
    const iconElm = document.querySelector("#w-icon");
    const temperatureElm = document.querySelector("#w-temp");
    const pressureElm = document.querySelector("#w-pressure");
    const humidityElm = document.querySelector("#w-humidity");
    const feelElm = document.querySelector("#w-feel");
    const formElm = document.querySelector("#form");
    const countryElm = document.querySelector("#country");
    const messageElm = document.querySelector("#messageWrapper");
    return {
      cityInfoElm,
      cityElm,
      countryElm,
      iconElm,
      temperatureElm,
      pressureElm,
      feelElm,
      humidityElm,
      formElm,
      messageElm,
    };
  },

  hideMSg() {
    const messageElm = document.querySelector("#message");

    setTimeout(() => {
      messageElm.remove();
    }, 2000);
  },

  showMsg(msg) {
    const { messageElm } = this.loadSelectors();
    const elm = `<div class="alert alert-danger" id='message'>${msg}</div>`;
    messageElm.insertAdjacentHTML("afterbegin", elm);

    this.hideMSg();
  },

  validationInput(country, city) {
    if (country === "" || city === "") {
      this.showMsg("Please Enter The Value");
      return true;
    } else {
      return false;
    }
  },

  getInputValues() {
    const { countryElm, cityElm } = this.loadSelectors();

    const isInvalid = this.validationInput(countryElm.value, cityElm.value);
    if (isInvalid) return;
    return {
      country: countryElm.value,
      city: cityElm.value,
    };
  },
  resetInputs() {
    const { countryElm, cityElm } = this.loadSelectors();
    (countryElm.value = ""), (cityElm.value = "");
  },

  async handleRemoteData() {
    const data = await weatherData.getWeather();
    return data;
  },

  getIcon(iconCode) {
    return `https://api.openweathermap.org/w/${iconCode}.png`;
  },

  populateUI(data) {
    const {
      cityInfoElm,
      temperatureElm,
      pressureElm,
      humidityElm,
      iconElm,
      feelElm,
    } = this.loadSelectors();

    const {
      name,
      main: { temp, humidity, pressure },
      weather,
    } = data;

    cityInfoElm.textContent = name;
    temperatureElm.textContent = `Temperature: ${temp}`;
    pressureElm.textContent = `Pressure: ${pressure}`;
    humidityElm.textContent = `Humidity: ${humidity}`;
    feelElm.textContent = weather[0].description;
    iconElm.setAttribute("src", this.getIcon(weather[0].icon));
  },

  init() {
    const { formElm } = this.loadSelectors();

    formElm.addEventListener("submit", async (evt) => {
      evt.preventDefault();

      const { country, city } = this.getInputValues();

      weatherData.city = city;
      weatherData.country = country;
      //  console.log(country,city)
      this.resetInputs(country, city);

      const data = await this.handleRemoteData();
      console.log(data);

      this.populateUI(data);
    });
  },
};
UI.init();

const weatherData = {
  city: "",
  country: "",
  API_KEY: "01b7562bbe535ff4d6a40507ef418d9b",

  async getWeather() {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`
      );
      const { name, main, weather } = await res.json();
      return {
        name,
        main,
        weather,
      };
    } catch (error) {
      UI.showMsg("API Not Working");
    }
  },
};

const storage = {};
