import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default fetcher;

// fetcher can now be used with SWR library in any component to fetch data from APIs