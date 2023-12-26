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

export function useDogById(dogId: string): {
  dogData: DogType;
  loading: boolean;
  error: string | null;
} {
  const [dogData, setDogData] = useState<DogType>(
    {  displayId: "",
    dogname: "",
    imageUrl: "",
    breed: "",
    gender: "",
    birthday: "",
    description: ""
    });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null || "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/dogs/${dogId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Process and format data if needed
        setDogData(data);
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
    console.log("fetched Dog Data");
  }, [dogId]);

  return { dogData, loading, error };
}
