"use client";

import LoadingModal from "@/components/LoadingModal";
import { useMatches } from "@/hooks/useMatches";

import DogCard from "./_components/DogCard";

function MessagePage() {
  const { matches, loading } = useMatches();
  if (loading) {
    return <LoadingModal />;
  }
  if (matches.length === 0) {
    return <>No matches yet!!</>;
  }
  return (
    <div>
      <div className="grid grid-cols-1 gap-10 overflow-y-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {matches.map((match) => (
          <div id={match.dog.id} key={match.dog.id}>
            <DogCard
              id={match.dog.id}
              dogname={match.dog.dogname}
              breed={match.dog.breed}
              gender={match.dog.gender}
              birthday={match.dog.birthday}
              description={match.dog.description}
              image_url={match.dog.image_url}
              thumbnail_url={match.dog.thumbnail_url}
              content={
                match.lastMessage.content ? match.lastMessage.content : null
              }
              senderId={match.lastMessage.senderId}
              sentAt={match.lastMessage.sentAt}
              isNew={match.new ? match.new : false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessagePage;
