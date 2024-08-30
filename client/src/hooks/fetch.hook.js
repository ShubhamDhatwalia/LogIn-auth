import { useEffect, useState } from "react";
import axios from "axios";
import { getUsername } from "../helper/helper";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export default function useFetch(query) {
  const [getData, setData] = useState({
    isLoading: false,
    apiData: undefined,
    status: null,
    serverError: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));
        const { username } = !query ? await getUsername() : "";
        const url = !query ? `/api/user/${username}` : `/api/${query}`;
        const { data, status } = await axios.get(url);

        if (status === 201 || status === 200) {
          setData((prev) => ({
            ...prev,
            isLoading: false,
            apiData: data,
            status: status,
          }));
        } else if (status === 440) {
          console.warn(`Session expired`);
          setData((prev) => ({
            ...prev,
            isLoading: false,
            serverError: new Error("Session expired"),
          }));
        } else {
          console.warn(`Unexpected status code: ${status}`);
          setData((prev) => ({
            ...prev,
            isLoading: false,
            apiData: data,
            status: status,
          }));
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setData((prev) => ({ ...prev, isLoading: false, serverError: error }));
      }
    };

    fetchData();
  }, [query]);


  return [getData, setData];
}
