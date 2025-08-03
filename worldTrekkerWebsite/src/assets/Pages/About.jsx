import countryFacts from "../../api/countryData.json";
// console.log(countryFacts);

export const About = () => {
  return (
    <>
      <section className="section-about container">
        <h2 className="container-title">
          Here are the Interesting Facts <br /> We're proud of
        </h2>
        <div className="gradient-cards">
          {countryFacts.map((country) => {
            const { id, CountryName, Capital, Population, InterestingFact } =
              country;
            return (
              <div className="card" key={id}>
                <div className="container-card bg-blue-box">
                  <p className="card-title">{CountryName}</p>
                  <p>
                    <span className="card-description">Capital: </span>
                    {Capital}
                  </p>
                  <p>
                    <span className="card-description">Population: </span>
                    {Population}
                  </p>
                  <p>
                    <span className="card-description">Interesting Fact: </span>
                    {InterestingFact}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
