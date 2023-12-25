"use client";

import { useMatches } from "@/hooks/useMatches";

import DogCard from "./_components/DogCard";

function MessagePage() {
  const { matches, loading } = useMatches();
  if (loading) {
    return <>Loading...</>;
  }
  return (
    <div>
      <div className="grid grid-cols-1 gap-10 py-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {matches.map((dog) => (
          <div id={dog.id} key={dog.id}>
            <DogCard {...dog} lastMessage="" mode={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessagePage;
