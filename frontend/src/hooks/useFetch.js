import React, { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (api, options = {}, token) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true; // Track mounted status

    const fetchData = async () => {
      try {
        setLoading(true);
        const config = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : "",
          },
        };
        const response = await axios.get(api, config);
        if (isMounted) {
          setData(response.data.data); // Adjust according to your API response
        }
      } catch (error) {
        if (isMounted) {
          setError(error.response?.data?.message || error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to cancel pending requests
    return () => {
      isMounted = false;
    };
  }, [api, options, token]);

  return { data, error, loading };
};

export default useFetch;