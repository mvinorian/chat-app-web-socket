import { useEffect, useState } from "react";

export default function App({ socket }) {
  const [state, setState] = useState("login");
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState("");
  const [editing, setEditing] = useState(0);

  useEffect(() => {
    if (socket)
      socket.onmessage = ({ data }) => {
        const chats = JSON.parse(data);
        setChats(() => chats);
      };
  }, [socket]);

  const postChat = (message) => {
    const data = JSON.stringify({
      method: "post",
      data: {
        sender: user,
        message: message,
      },
    });
    socket.send(data);
  };

  const updateChat = (chatId, message) => {
    const data = JSON.stringify({
      method: "update",
      data: {
        id: chatId,
        sender: user,
        message: message,
      },
    });
    socket.send(data);
  };

  const deleteChat = (chatId) => {
    const data = JSON.stringify({
      method: "delete",
      data: {
        id: chatId,
      },
    });
    socket.send(data);
  };

  return (
    <main className="h-screen flex flex-col justify-center items-center px-12 py-8 bg-slate-500 text-slate-800">
      {/* Login State */}
      {state === "login" && (
        <section className="w-96 flex flex-col space-y-4 p-2 rounded-md bg-slate-400 shadow-lg">
          <h1 className="font-bold text-2xl">Chat Room</h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const username = event.target.username.value;
              username && setUser(() => username);
              username && setState(() => "chat");
            }}
            className="flex flex-row space-x-2 rounded-b-md bg-slate-400"
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="flex-1 rounded-md px-2 py-1 text-sm bg-slate-200"
            />
            <button
              type="submit"
              className="w-fit h-full rounded-md px-2 bg-slate-200 hover:bg-slate-300"
            >
              Join Chat
            </button>
          </form>
        </section>
      )}

      {/* Chat State */}
      {state === "chat" && (
        <section className="w-96 h-full flex flex-col rounded-md bg-slate-300 shadow-lg">
          {/* Chat Header */}
          <div className="w-full flex flex-row justify-between p-2 rounded-t-md bg-slate-400">
            <h1 className="text-2xl">
              Login as <span className="font-semibold">{user}</span>
            </h1>
          </div>

          {/* Chat Messages */}
          <ul className="list-none h-full flex flex-col justify-end space-y-2 overflow-y-hidden">
            {chats.map((chat) => (
              <li
                key={chat.id}
                className="flex flex-col py-2 border-t border-slate-200"
              >
                {editing === chat.id ? (
                  <form
                    onSubmit={(event) => {
                      const message = event.target.message.value;
                      message && updateChat(chat.id, message);
                      event.preventDefault();
                      setEditing(() => 0);
                    }}
                    className="w-full flex flex-col px-2"
                  >
                    <div className="w-full flex flex-row justify-between px-2">
                      <h6 className="text-sm">{chat.sender}</h6>
                      <div className="w-full flex flex-row justify-end gap-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(() => 0);
                          }}
                          className={`${
                            user !== chat.sender && "hidden"
                          } text-xs text-slate-500 hover:text-slate-800`}
                        >
                          Escape
                        </button>
                        <button
                          type="submit"
                          className={`${
                            user !== chat.sender && "hidden"
                          } text-xs text-slate-500 hover:text-slate-800`}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      name="message"
                      placeholder={chat.message}
                      className="flex-1 rounded-md mt-1 px-2 py-1 text-sm bg-slate-200"
                    />
                  </form>
                ) : (
                  <div className="w-full flex flex-col px-4">
                    <div className="w-full flex flex-row justify-between">
                      <h6 className="text-sm">{chat.sender}</h6>
                      <div className="w-full flex flex-row justify-end gap-x-2">
                        <button
                          onClick={() => setEditing(() => chat.id)}
                          className={`${
                            user !== chat.sender && "hidden"
                          } text-xs text-slate-500 hover:text-slate-800`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteChat(chat.id)}
                          className={`${
                            user !== chat.sender && "hidden"
                          } text-xs text-slate-500 hover:text-slate-800`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p>{chat.message}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Chat Footer */}
          <form
            onSubmit={(event) => {
              const message = event.target.message.value;
              message && postChat(message);
              event.target.message.value = "";
              event.preventDefault();
            }}
            className="flex flex-row space-x-2 p-2 rounded-b-md bg-slate-400"
          >
            <input
              type="text"
              name="message"
              placeholder="Message"
              className="flex-1 rounded-md px-2 py-1 text-sm bg-slate-200"
            />
            <button
              type="submit"
              className="w-fit h-full rounded-md px-2 bg-slate-200 hover:bg-slate-300"
            >
              Send
            </button>
          </form>
        </section>
      )}
    </main>
  );
}
