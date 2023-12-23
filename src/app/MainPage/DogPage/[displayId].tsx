import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

const DogPage = () => {
  const router = useRouter();
  const { displayId } = router.query; // Accessing the dynamic route parameter
  const [dogInfo, setDogInfo] = useState(null);

  useEffect(() => {
    if (!displayId) return; // Ensure displayId is not undefined

    // Fetch dog information based on displayId
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/dogs/${displayId}`);
        const data = await response.json();
        setDogInfo(data);
      } catch (error) {
        console.error("Error fetching dog information:", error);
      }
    };

    fetchData();
  }, [displayId]);

  if (!dogInfo) return <div>Loading...</div>;

  return (
    <div>
      <h1>123</h1>
      {/* <h2>{dogInfo.dogname}</h2> */}
      {/* ... rest of your component */}
    </div>
  );
};

export default DogPage;
