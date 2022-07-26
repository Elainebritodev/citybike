import React, { createContext, useContext, useState, useEffect } from 'react';
import geoService from '../api/geoService';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [inputValue, setInputValue] = useState();
  const [selectValue, setSelectValue] = useState([]);
  const [initialLat, setInitialLat] = useState(-23.000372);
  const [initialLong, setInitialLong] = useState(-43.365894);
  const [countryData, setCountryData] = useState([]);
  const [countryStations, setCountryStations] = useState([]);
  const [countryNetworks, setCountryNetworks] = useState([]);
  const [allNetworks, setAllNetworks] = useState([]);
  const [allStations, setAllStations] = useState([]);
  const [done, setDone] = useState(true);
  const [networkLength, setNetworkLength] = useState(0);


  const getOptions = async () => {
    const {
      data: { networks },
    } = await geoService.getNetworks();

    let allCountries = [];
    networks.forEach((networks) => allCountries.push(networks.location.country));
    const countriesFilter = new Set(allCountries);
    const countriesArray = [...countriesFilter]
    setSelectValue(countriesArray.sort());
    setInputValue('PT');
  }

  useEffect(() => {
    getOptions();
  }, []);

  const getNetworksCountry = async () => {
    setDone(false)
    setCountryData([])
    setCountryNetworks([])
    setCountryStations([])
    setAllNetworks([])
    setAllStations([])
    setNetworkLength(0)
    const { data: { networks } } = await geoService.getNetworks();
    const getCountry = networks
      .filter((network) => network.location.country === inputValue);
    setInitialLat(getCountry[0].location.latitude)
    setInitialLong(getCountry[0].location.longitude)
    setCountryData(getCountry)
  }

  useEffect(() => {
    if (inputValue) {
      getNetworksCountry();
    }

  }, [inputValue]);

  const handleCountryData = (data) => {
    const hrefs = data.map((network) => network.href)

    hrefs.forEach((href) => {
      getStationsCountry(href);
    })
  }

  useEffect(() => {
    handleCountryData(countryData);
  }, [countryData])

  const getStationsCountry = async (href) => {
    const { data: { network } } = await geoService.getStations(href)

    if (
      network.stations.length !== 0 &&
      network.stations.length !== undefined
    ) {
      const countryNetwork = {
        name: network.name,
        stationsLen: network.stations.length,
      }
      setCountryNetworks(countryNetwork);
    }

    const locationStations = network.stations.map((stationData) => {
      return {
        type: 'Feature',
        properties: {
          description: `
          <p>${stationData.name ? stationData.name : ''}</p>
          <p>Empty Slots: ${stationData.empty_slots ? stationData.empty_slots : '0'}</p>
          <p>Free bikes: ${stationData.free_bikes ? stationData.free_bikes : '0'}</p>
          <p>Longitude: ${stationData.longitude ? stationData.longitude : '0'}</p>
          <p>Latitude: ${stationData.latitude ? stationData.latitude : '0'}</p>
          `,
          icon: 'bicycle'
        },
        geometry: {
          type: 'Point',
          coordinates: [stationData.longitude, stationData.latitude]
        },
      };
    });
    setCountryStations(locationStations);

    setTimeout(() => {
      setDone(true);
    }, 3000)
  }

  useEffect(() => {
    if (countryStations.length !== 0) {
      const allStationsArray = allStations.concat(countryStations)
      setAllStations(allStationsArray)
    }
  }, [countryStations])

  useEffect(() => {
    const allNetworksArray = allNetworks.concat(countryNetworks);
    setAllNetworks(allNetworksArray)
  }, [countryNetworks])

  useEffect(() => {
    setNetworkLength(allNetworks.length)
  }, [done])
  return (
    <StateContext.Provider
      value={{
        inputValue,
        setInputValue,
        selectValue,
        initialLat,
        initialLong,
        allStations,
        networkLength,
        allNetworks,
        done
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
