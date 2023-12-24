import { useState, useEffect } from "react";

type DogType = {
  displayId: string;
  dogname: string;
  imageUrl: string;
  breed: string;
  gender: string;
  birthday: string;
  description: string;
};

export function useDogsInfo(): {
  dogsData: DogType[];
  loading: boolean;
  error: string | null;
} {
  const [dogsData, setDogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null || "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alldogs`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Process and format data if needed
        setDogsData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dogsData, loading, error };
}
