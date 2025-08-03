import axios from "axios";

const api = axios.create({

  baseURL:
    "https://www.restcountries.com/v3.1"
  
});
// /all?fields=name.population,region,capital,flags

// HTTP GET METHOD 
export const getCountryData = () => {
  
  return api.get("/all?fields=name,population,region,capital,flags");
  
}

// HTTP GET METHOD fro the indiv. country name
export const getCountryIndData = (name) => {
  return api.get(`/name/${name}?fullText=true&fields=name,population,region,subregion,capital,tld,currencies,languages,borders,flags`);
};