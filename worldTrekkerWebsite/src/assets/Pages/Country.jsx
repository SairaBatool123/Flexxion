import { useState, useTransition } from "react";
import { useEffect } from "react";
import { getCountryData } from "../../api/axios";
import { Loader } from "../../components/UI/Loader";
import CountryCard from "../../components/Layout/CountryCard";
import { SearchFilter } from "../../components/UI/SearchFilter";


export const Country = () => {
  const [isPending, startTransition] = useTransition();
const [countries,setCountries] = useState([])

  const [search , setSearch]=useState()
  const [filter , setFilter]=useState("all")
  useEffect(() => {

    startTransition(async() => {
      const res = await getCountryData()
      // console.log(res);
      setCountries(res.data)
      
   })
  }, [])
  
  if (isPending) {
    return <Loader />
  }
  const searchCountry = (country) => {
    if (search) {
      return country.name.common.toLowerCase().includes(search.toLowerCase())
    }
    return country;
  };
  const filterRegion = (country) => {
    if (filter === "all") {
      return country
    }
    return country.region === filter;
  };

  
  // console.log(search,filter);

  // MAIN LOGIC In SEARCH IN EVERY PROJECT
  const filterCountries = countries.filter((country) => searchCountry(country) && filterRegion(country));



  return (
    <section className="country-section">
      <ul className="grid grid-four-cols">
        {/* SEARCH-SECTION  */}

        <SearchFilter
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter} countries={countries} setCountries={setCountries}
        />

        {filterCountries.map((curCountry, index) => {
          return <CountryCard country={curCountry} key={index}></CountryCard>;
        })}
      </ul>
    </section>
  );
};
