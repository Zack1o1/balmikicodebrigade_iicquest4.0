import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface CheckboxItem {
  id: string;
  text: string;
  checked: boolean;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  checklist?: CheckboxItem[];
}

export default function PalikaChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Namaste! I am your PalikaAI assistant. Ask me about dynamic municipal documentation requirements. Try choosing from the suggestions below!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleAuthFailure = (errorMessage: string) => {
    setAuthError(errorMessage);
    localStorage.removeItem("iic_token");
    setIsThinking(false);
    setTimeout(() => {
      window.location.href = "/login";
    }, 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("iic_token");
    if (!token) {
      handleAuthFailure("Not authorized: No session token found. Redirecting to login page...");
    }
  }, []);

  const predefinedQuestions = [
    { label: "Birth Registration", query: "Birth Registration requirements" },
    { label: "Citizenship", query: "Nagarikta banauna k k chahincha?" },
    { label: "House Map Approval", query: "House map approval naksa pass process" },
    { label: "Migration Certificate", query: "Basai sarai garna k k chaincha" },
    { label: "Property Transfer", query: "Land property ownership transfer naamsari documents" },
    { label: "Minor Identity Card", query: "Nabaalig Parichayapatra process" },
    { label: "Single Status", query: "Unmarried status certificate details" },
    { label: "Water/Electricity Connection", query: "Water meter and electricity batti jadan sifaris" },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const extractChecklist = (text: string): CheckboxItem[] => {
    const lines = text.split("\n");
    return lines
      .filter((line) => line.trim().startsWith("•") || line.trim().startsWith("-"))
      .map((line, index) => ({
        id: `chk-${Date.now()}-${index}`,
        text: line.replace(/^[•\-\s]+/, "").trim(),
        checked: false,
      }));
  };

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;
    if (authError) return;

    const token = localStorage.getItem("iic_token");
    if (!token) {
      handleAuthFailure("Not authorized: Session missing. Redirecting to login page...");
      return;
    }

    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text: messageText }]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (response.status === 401 || response.status === 403) {
        handleAuthFailure("Not authorized: Access denied by server. Redirecting to login page...");
        return;
      }

      const data = await response.json();
      setIsThinking(false);

      if (response.ok) {
        const aiMsgId = `ai-${Date.now()}`;
        const parsedChecklist = extractChecklist(data.response);

        setMessages((prev) => [
          ...prev,
          {
            id: aiMsgId,
            sender: "ai",
            text: data.response,
            checklist: parsedChecklist.length > 0 ? parsedChecklist : undefined,
          },
        ]);
      } else {
        const aiMsgId = `ai-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          { id: aiMsgId, sender: "ai", text: `Backend Error: ${data.message}` },
        ]);
      }
    } catch (error) {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: "Connection Error: Could not contact backend. Ensure your backend is running and Vite proxy matches the port configuration.",
        },
      ]);
    }
  };

  const toggleCheckbox = (messageId: string, checkboxId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.checklist) {
          return {
            ...msg,
            checklist: msg.checklist.map((item) =>
              item.id === checkboxId ? { ...item, checked: !item.checked } : item
            ),
          };
        }
        return msg;
      })
    );
  };

  return (
    <div className="flex my-16 flex-col h-[650px] max-w-2xl mx-auto border border-slate-200 bg-slate-50 rounded-2xl shadow-md overflow-hidden relative">
      
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center z-10">
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2">Smart Palika AI</h2>
          <p className="text-xs text-blue-100">Smart Document Verification System</p>
        </div>
        <span className="bg-emerald-500 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-emerald-400">
          Secure Session
        </span>
      </div>

      {authError && (
        <div className="bg-red-600 text-white text-xs font-semibold px-4 py-3 text-center shadow-md animate-pulse z-20">
          {authError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[90%] p-3.5 rounded-2xl text-sm leading-relaxed ${
              msg.sender === "user"
                ? "bg-blue-600 text-white rounded-tr-none"
                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs"
            }`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>

              {msg.checklist && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 bg-slate-50 p-3 rounded-xl">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                    Verify Your Prepared Documents:
                  </p>
                  {msg.checklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-2.5 p-1.5 hover:bg-slate-100 rounded-md cursor-pointer select-none transition"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleCheckbox(msg.id, item.id)}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded-sm focus:ring-blue-500"
                        disabled={!!authError}
                      />
                      <span className={`text-xs transition ${item.checked ? "line-through text-slate-400 font-medium" : "text-slate-700"}`}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                  
                  <div className="text-[11px] text-blue-600 font-semibold pt-1">
                    Prepared: {msg.checklist.filter(c => c.checked).length} of {msg.checklist.length} items
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 text-slate-500 py-3 px-4 rounded-2xl rounded-tl-none shadow-xs text-sm flex items-center space-x-1.5">
              <span className="font-medium text-xs text-slate-400 animate-pulse">Consulting legal dataset</span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-slate-100 max-h-[105px] overflow-y-auto">
        <p className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Quick Search Suggestions:</p>
        <div className="flex flex-wrap gap-1.5">
          {predefinedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.query)}
              disabled={!!authError}
              className="bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-slate-600 text-[11px] px-2.5 py-1 rounded-full transition cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
        className="p-3 bg-white border-t border-slate-200 flex space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={authError ? "Session locked..." : "Type here..."}
          disabled={!!authError}
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-none text-sm px-3 py-2 rounded-xl disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={!!authError}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl font-medium shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}