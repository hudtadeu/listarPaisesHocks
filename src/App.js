import React, { useEffect, useState } from 'react';
import Countries from './components/Countries';
import Header from './components/header/Header';


export default function App() {
  const { allCountries, setAllCountries } = useState([]);
  const { filteredCountries, setFilteredCountries } = useState([]);
  const { filteredPopulation, setFilteredPopulation } = useState(0);
  const { userFilter, setUserFilter } = useState('');

  useEffect(() => {
    const getCountries = async () => {
      const res = await fetch('https://restcountries.eu/rest/v2/all');
      let allCountries = await res.json();

      allCountries = allCountries.map(({ name, numeriCode, flag, population }) => {
        return {
          id: numeriCode,
          name,
          filterName: name.toLowerCase(),
          flag,
          population,
        };
      });

      setAllCountries(allCountries);
      setFilteredCountries(Object.assign([], allCountries));
    }

    getCountries();
  }, [])

  const calcuteTotalPopulationFrom = (countries) => {
    const totalPopulation = countries.reduce(
      (accumulator, current) => {
        return accumulator + current.population;
      }, 0);

    return totalPopulation;
  }

  const handleChangeFilter = (newText) => {
    setUserFilter(newText);

    const filterLowerCase = newText.toLowerCase();

    const filteredCountries = allCountries.filter(country => {
      return country.filterName.includes(filterLowerCase);
    });

    const filteredPopulation = calcuteTotalPopulationFrom(filteredCountries);

    setFilteredCountries(filteredCountries);
    setFilteredPopulation(filteredPopulation);
  };

  return (
    <div className="container">
      <h1 style={styles.centeredTitle}>React Countries</h1>

      <Header
        filter={userFilter}
        countryCount={filteredCountries.length}
        totalPopulation={filteredPopulation}
        onChangeFilter={handleChangeFilter}
      />
      <Countries countries={filteredCountries} />
    </div>
  );
}

const styles = {
  centeredTitle: {
    textAlign: 'center',
  },
}