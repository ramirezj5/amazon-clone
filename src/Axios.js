import axios from "axios";

const instance = axios.create({
    baseURL: 'https://api-drhavio4na-uc.a.run.app'
    // local host baseURL: 'http://127.0.0.1:5001/clone-c64a5/us-central1/api' // The api (cloud function) URL
}); 

export default instance;