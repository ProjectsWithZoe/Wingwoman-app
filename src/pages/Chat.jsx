import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import {
  collection,
  query,
  orderBy,
  addDoc,
  onSnapshot,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Button } from "../components/Button";
import SwipeableCarousel from "../components/SwipeableCarousel";

function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [messageLimitReached, setMessageLimitReached] = useState(false); // State for message limit

  const promptSuggestions = [
    "Why are they ghosting me?",
    "Tips to improve my dating profile",
    "Why is he like this?",
    "What should I do to apologize to her?",
    "Is my situationship healthy or should I end it? ",
    "How do i ask her to be my girlfriend?",
    "How should I meet people without dating apps?",
    "Why did she friendzone me?",
  ];

  const nextPrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % promptSuggestions.length);
  };

  const prevPrompt = () => {
    setCurrentPromptIndex(
      (prev) => (prev - 1 + promptSuggestions.length) % promptSuggestions.length
    );
  };

  const handlePromptClick = (prompt, index) => {
    setCurrentPromptIndex(index);
    setInput(prompt); // Fill the input with the selected prompt
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextPrompt,
    onSwipedRight: prevPrompt,
    preventScrollOnSwipe: true,
    trackMouse: true, // Enables swipe detection on desktop
  });

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    console.log("clicked");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/");
      else {
        setIsAuthenticated(true);
      }
    });
    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated || !auth.currentUser) return;

    const q = query(
      collection(db, "conversations"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("created_at", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setConversations(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return unsubscribe;
  }, [isAuthenticated]);

  useEffect(() => {
    if (!auth.currentUser || !activeChat) return;

    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", activeChat),
      orderBy("created_at", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [activeChat]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "messages"),
      where("userId", "==", auth.currentUser.uid) // Get all messages sent by the user
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userMessages = snapshot.docs.length;
      checkMessageLimit(userMessages); // Check the message limit when messages are updated
      console.log(userMessages);
    });

    return unsubscribe;
  }, [auth.currentUser]); // Runs whenever the user state changes

  // Check if message limit has been reached
  const checkMessageLimit = (messageCount) => {
    if (messageCount >= 10) {
      setMessageLimitReached(true); // If 10 or more messages, show paywall
    } else {
      setMessageLimitReached(false); // Otherwise, allow more messages
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    if (messageLimitReached) {
      alert("You've reached the message limit. Please upgrade to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      let chatId = activeChat;
      if (!chatId) {
        const newChatRef = await addDoc(collection(db, "conversations"), {
          userId: auth.currentUser.uid,
          created_at: serverTimestamp(),
        });
        chatId = newChatRef.id;
        console.log(chatId);
        setActiveChat(chatId);
      }

      await addDoc(collection(db, "messages"), {
        role: "user",
        content: input,
        created_at: serverTimestamp(),
        userId: auth.currentUser.uid,
        conversationId: chatId,
      });

      await addDoc(collection(db, "messages"), {
        role: "assistant",
        content: data.result,
        created_at: serverTimestamp(),
        userId: auth.currentUser.uid,
        conversationId: chatId,
      });

      setInput("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  // Handle creating a new chat when the pencil button is clicked
  const handleNewChat = async () => {
    // Clear the input and set activeChat to null
    setInput("");
    setActiveChat(null);
    // Optionally, you can also create a new conversation here
    const newChatRef = await addDoc(collection(db, "conversations"), {
      userId: auth.currentUser.uid,
      created_at: serverTimestamp(),
    });
    setActiveChat(newChatRef.id); // Set the newly created chat as the active one
  };

  return (
    <div
      //style={{ fontFamily: '"Poppins", sans-serif', fontSize: "20px" }}
      className="flex flex-col h-screen bg-gray-900"
    >
      {/* Toggle Button (Only for Mobile) */}

      {/* Sidebar */}

      {/* Chat Section */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800 text-white">
        <button onClick={toggleDropdown}>
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="flex items-center gap-2">
          <img
            src="/images/logo3.png"
            className="mx-auto h-auto w-16 text-primary-500 text-center"
          ></img>
          <h1
            className="text-xl font-bold"
            /*style={{
              fontFamily: '"Lavishly Yours", sans-serif',
              fontSize: "36px",
            }}*/
          >
            WingWoman
          </h1>
        </div>
        <Button variant="secondary" onClick={handleSignOut}>
          <i className="fa-solid fa-right-from-bracket"></i>
        </Button>
      </header>
      {/* Sidebar */}
      {isDropdownOpen && (
        <div className="flex flex-col justify absolute top-0 left-0 w-[50%] bg-gray-700 border-r border-b border-gray-900 h-[88%] rounded text-white p-4 max-h-screen w-[50%] overflow-y-auto z-20">
          <div className="flex flex-col align-items">
            <div className="flex flex-row justify-between">
              <h2 className="text-lg font-bold mb-4">Previous Chats</h2>
              <button onClick={toggleDropdown}>
                <i className="fa-solid fa-bars"></i>
              </button>
            </div>
          </div>

          <div className="space-y-2 border-grey-600 rounded">
            {conversations.map((chat) => (
              <button
                key={chat.id}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  chat.id === activeChat
                    ? "bg-primary-500 text-white"
                    : "bg-red-700"
                }`}
                onClick={() => setActiveChat(chat.id)}
              >
                Chat {chat.id.slice(-4)}
              </button>
            ))}
          </div>

          <div className="flex flex-col justify-end">
            <Button variant="secondary" onClick={handleSignOut}>
              <i className="fa-solid fa-right-from-bracket"></i> Sign out
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 max-w-xs rounded-2xl ${
                msg.role === "user"
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Carousel for Prompts */}
      <div
        {...handlers}
        className="flex items-center justify-center space-x-4 p-4 bg-gray-800"
      >
        <button
          onClick={prevPrompt}
          className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <div className="flex items-center gap-4 overflow-x-auto">
          {promptSuggestions.map((prompt, index) => (
            <button
              key={index}
              className={`p-2 rounded-lg whitespace ${
                currentPromptIndex === index
                  ? "bg-primary-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
              onClick={() => handlePromptClick(prompt, index)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <button
          onClick={nextPrompt}
          className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      {/* Input Form */}
      {messageLimitReached ? (
        <div className="text-center p-4 bg-red-700 text-white">
          <h2>
            You have reached your message limit. Please upgrade to continue.
          </h2>
          {/* Add your paywall here */}
          <Button variant="primary" onClick={() => alert("Go to payment page")}>
            Upgrade Now
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-800 p-4 flex gap-4"
        >
          <button>
            <i className="fa-solid fa-lg fa-pen-to-square"></i>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="I need advice on..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-primary-500"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              <i className="fa-solid fa-arrow-right"></i>
            )}
            Send
          </Button>
        </form>
      )}
    </div>
  );
}

export default Chat;
