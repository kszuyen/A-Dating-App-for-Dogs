import ChatRoomHeader from "./_components/ChatRoomHeader";
import ChatRoomInput from "./_components/ChatRoomInput";
import ChatRoomMessages from "./_components/ChatRoomMessages";

function ChatPage() {
  return (
    <div>
      <div className="flex h-full min-h-screen w-full flex-col overflow-hidden shadow-lg ">
        <div className=" sticky top-0 bg-purple-200">
          <div className="p-2">
            <ChatRoomHeader />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChatRoomMessages />
        </div>
        <div className="sticky bottom-0 p-2">
          <ChatRoomInput />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
