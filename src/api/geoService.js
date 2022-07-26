import axios from 'axios';

export default class geoService {
  static getNetworks() {
    return axios(`http://api.citybik.es/v2/networks`);
  }
  static getStations(href) {
    return axios(`http://api.citybik.es${href}`);
  }
}