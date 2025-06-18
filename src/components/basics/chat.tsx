import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  HTMLAttributes,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { RoomMemberData } from "@/app/(dashboard)/workroom/room/[roomId]/page";

// Helper function to format timestamps for display
const formatTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Removed Viewer interface, as IMember will be used directly or mapped from

// Mock data for initial messages. The 'sender' and 'viewedBy' IDs here
// would ideally come from a backend or consistent user data. For this example,
// they are illustrative and assume some matching IDs with generated chatUsers.
const initialMessages = [
  {
    id: 1,
    sender: "Sofia Davis", // This could be replaced by a real member name
    text: "Hi, how can I help you today?",
    isUser: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    viewedBy: ["olivia", "emma"], // These should ideally be member IDs
  },
  {
    id: 2,
    sender: "User", // This represents the current user
    text: "Hey, I'm having trouble with my account.",
    isUser: true,
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    viewedBy: ["sophia"],
  },
  {
    id: 3,
    sender: "Sofia Davis",
    text: "What seems to be the problem?",
    isUser: false,
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    viewedBy: ["olivia", "jackson", "william", "james"],
  },
  {
    id: 4,
    sender: "User",
    text: "I can't log in.",
    isUser: true,
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    viewedBy: ["isabella", "david"],
    attachment: {
      type: "image",
      url: "https://placehold.co/200x150/AED6F1/000?text=Screenshot",
      name: "screenshot.png",
    },
  },
];

/**
 * Main App component for the chat interface.
 * Features: Expandable/Minimizable chat window, Timestamps, Hover-to-view message viewers,
 * File attachments, @Mentions, Shadcn/UI styling, Framer Motion animations.
 */
type AttachedFile = {
  name: string;
  type: string;
  url: string;
};

// Define the shape of a chat user for internal consistency, derived from IMember
interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar: string; // avatar_url from IMember
}

interface ChatProps extends HTMLAttributes<HTMLDivElement> {
  members: RoomMemberData[]; // Prop to receive members from page.tsx
}

const DefaultAvatarPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export default function Chat({ members }: ChatProps) { //make chat draggable
  // Derive chatUsers from the members prop
  const chatUsers: ChatUser[] = useMemo(() => {
    return members.map((member) => ({
      id: String(member.id), // Ensure ID is a string
      name:
        member.username ||
        `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() ||
        member.email ||
        "Unknown User",
      email: member.email || "unknown@example.com",
      avatar: member.avatar_url || DefaultAvatarPlaceholder, // Use default if avatar_url is missing
    }));
  }, [members]);

  const [messages, setMessages] = useState(initialMessages);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  const [viewersToDisplayInModal, setViewersToDisplayInModal] = useState<
    ChatUser[] | null
  >(null); // Type for viewers in modal

  // States for @mention feature
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearchTerm, setMentionSearchTerm] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLDivElement>(null);

  // Helper to get viewer details from chatUsers
  const getChatUserDetails = useCallback(
    (userId: string): ChatUser | undefined => {
      return chatUsers.find((u) => u.id === userId);
    },
    [chatUsers]
  );

  // Scroll to the latest message whenever messages update or chat expands
  useEffect(() => {
    if (isChatExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatExpanded]);

  // Clean up object URL when component unmounts or attachedFile changes
  useEffect(() => {
    return () => {
      if (attachedFile?.url) {
        URL.revokeObjectURL(attachedFile.url);
      }
    };
  }, [attachedFile]);

  // Effect to reset mention state when modal or chat is closed
  useEffect(() => {
    if (!isChatExpanded || isNewChatModalOpen || viewersToDisplayInModal) {
      setShowMentions(false);
      setMentionSearchTerm("");
      setSelectedMentionIndex(0);
    }
  }, [isChatExpanded, isNewChatModalOpen, viewersToDisplayInModal]);

  /**
   * Handles file selection from the input.
   * Creates an object URL for preview if it's an image/video.
   * @param {Event} e - The change event from the file input.
   */
  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleFileChange = (e: FileChangeEvent) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setAttachedFile({
      name: file.name,
      type: file.type,
      url: fileUrl,
    });
  };

  /**
   * Clears the currently attached file.
   */
  const clearAttachedFile = useCallback(() => {
    if (attachedFile?.url) {
      URL.revokeObjectURL(attachedFile.url);
    }
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [attachedFile, fileInputRef]);

  /**
   * Cleans the contenteditable div's HTML for sending.
   * Extracts text and replaces mention bubbles with "@username".
   */
  const getCleanMessageContent = useCallback(() => {
    if (!chatInputRef.current) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = chatInputRef.current.innerHTML;

    // Replace mention spans with their plain text equivalent
    tempDiv.querySelectorAll(".mention-bubble").forEach((span) => {
      span.replaceWith(`@${(span.textContent ?? "").trim()}`);
    });

    return tempDiv.textContent || tempDiv.innerText || "";
  }, [chatInputRef]);

  /**
   * Handles sending a new message.
   * Includes attached file data if present.
   */
  const handleSendMessage = useCallback(() => {
    const messageContent = getCleanMessageContent().trim();

    if (messageContent || attachedFile) {
      // Assuming the first member in chatUsers is the current user
      const currentUser = chatUsers[0] || {
        id: "user",
        name: "User",
        email: "user@example.com",
        avatar: DefaultAvatarPlaceholder,
      };

      const newMsg = {
        id: messages.length + 1,
        sender: currentUser.name,
        text: messageContent,
        isUser: true,
        timestamp: new Date().toISOString(),
        viewedBy: chatUsers
          .slice(0, Math.min(4, chatUsers.length))
          .map((u) => u.id), // Use actual chatUsers IDs
        ...(attachedFile ? { attachment: attachedFile } : {}),
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);

      // Clear the contenteditable div and attached file
      if (chatInputRef.current) {
        chatInputRef.current.innerHTML = "";
      }
      clearAttachedFile();
      setShowMentions(false); // Hide mentions on send

      // Simulate a response from a random chat user (not the current "User")
      setTimeout(() => {
        const otherChatUsers = chatUsers.filter((u) => u.id !== currentUser.id);
        const randomChatUser =
          otherChatUsers[Math.floor(Math.random() * otherChatUsers.length)];
        if (randomChatUser) {
          const botResponse = {
            id: messages.length + 2,
            sender: randomChatUser.name,
            text: `Okay, regarding "${
              newMsg.text || newMsg.attachment?.name || "your message"
            }", I received that.`,
            isUser: false,
            timestamp: new Date().toISOString(),
            viewedBy: [randomChatUser.id],
          };
          setMessages((prevMessages) => [...prevMessages, botResponse]);
        }
      }, 1000);
    }
  }, [
    attachedFile,
    chatInputRef,
    chatUsers,
    clearAttachedFile,
    getCleanMessageContent,
    messages.length,
    setShowMentions,
    setMessages,
  ]);

  /**
   * Handles input changes in the contenteditable div for mention detection.
   */
  const handleChatInput = () => {
    if (!chatInputRef.current) return;
    const text = chatInputRef.current.textContent;
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const caretPos = range.startOffset;
    const textBeforeCaret = (text ?? "").substring(0, caretPos);
    const lastAtIndex = textBeforeCaret.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const potentialMention = textBeforeCaret.substring(lastAtIndex + 1);
      // Only show mentions if the character after @ is not a space
      if (
        potentialMention.length === 0 ||
        !/\s/.test(potentialMention.charAt(0))
      ) {
        setMentionSearchTerm(potentialMention);
        setMentionStartIndex(lastAtIndex);
        setShowMentions(true);
        setSelectedMentionIndex(0); // Reset selected index on new search
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const filteredMentions = useMemo(() => {
    if (!showMentions) return [];
    return chatUsers
      .filter(
        (user) =>
          user.name.toLowerCase().includes(mentionSearchTerm.toLowerCase()) &&
          !getCleanMessageContent().includes(`@${user.name}`) &&
          !(
            chatInputRef.current &&
            chatInputRef.current.querySelector(`[data-user-id="${user.id}"]`)
          )
      )
      .slice(0, 5);
  }, [
    showMentions,
    chatUsers,
    mentionSearchTerm,
    getCleanMessageContent,
    chatInputRef,
  ]);

  /**
   * Inserts a mention bubble into the contenteditable div at the caret position.
   */
  const insertMention = useCallback((user: ChatUser) => {
    // Changed type to ChatUser
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;

    if (textNode.nodeType === Node.TEXT_NODE) {
      const textContent: string = textNode.textContent || "";
      const caretOffset: number = range.startOffset;
      // Find the start of the mention term (after the '@')
      const currentMentionStart = textContent
        .substring(0, caretOffset)
        .lastIndexOf("@");
      if (currentMentionStart === -1) return; // Should not happen if logic is correct, but for safety

      // Create a new text node for the part before the mention
      const preMentionText = textContent.substring(0, currentMentionStart);
      const newTextNode = document.createTextNode(preMentionText);
      textNode.parentNode?.replaceChild(newTextNode, textNode); // Replace old text node with new one

      // Set cursor immediately after the new text node
      selection.removeAllRanges();
      const tempRange = document.createRange();
      tempRange.setStart(newTextNode, newTextNode.length);
      tempRange.collapse(true);
      selection.addRange(tempRange);

      const mentionSpan: HTMLSpanElement = document.createElement("span");
      mentionSpan.textContent = `@${user.name}`; // Use user.name for display
      mentionSpan.dataset.userId = user.id;
      mentionSpan.className = "mention-bubble";
      mentionSpan.contentEditable = "false";

      const spaceNode: Text = document.createTextNode(" ");

      // Insert the mention and a space after it
      selection.getRangeAt(0).insertNode(mentionSpan);
      selection.getRangeAt(0).insertNode(spaceNode);

      selection.removeAllRanges();
      const finalRange: Range = document.createRange();
      finalRange.setStartAfter(spaceNode);
      finalRange.collapse(true);
      selection.addRange(finalRange);

      setShowMentions(false);
      setMentionSearchTerm("");
      setMentionStartIndex(-1);
    }
  }, []); // dependency array is empty because mentionStartIndex is not used

  /**
   * Handles key presses in the contenteditable div, especially for mentions.
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Logic for handling Enter, ArrowUp, ArrowDown for mentions
      if (showMentions && filteredMentions.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedMentionIndex(
            (prev) => (prev + 1) % filteredMentions.length
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedMentionIndex(
            (prev) =>
              (prev - 1 + filteredMentions.length) % filteredMentions.length
          );
        } else if (e.key === "Enter") {
          e.preventDefault();
          insertMention(filteredMentions[selectedMentionIndex]); // Use the selected filtered mention
        } else if (e.key === "Escape") {
          e.preventDefault();
          setShowMentions(false);
          setMentionSearchTerm(""); // Clear search on escape
        }
      }
      // If not handling a mention, and it's Enter, send message
      else if (e.key === "Enter" && !e.shiftKey) {
        // Allow shift+enter for new line
        e.preventDefault();
        handleSendMessage();
      }
    },
    [
      showMentions,
      filteredMentions,
      selectedMentionIndex,
      insertMention,
      handleSendMessage,
    ]
  );

  /**
   * Renders the appropriate icon for different file types.
   */
  interface FileIconProps {
    mimeType: string;
  }

  const getFileIcon = (mimeType: string): JSX.Element => {
    if (mimeType.startsWith("image/")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    }
    if (mimeType.startsWith("video/")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10l4.55-4.55a.75.75 0 011.06 0l.96.96c.29.29.29.76 0 1.05L16.07 12l5.5 5.5c.29.29.29.76 0 1.05l-.96.96c-.29.29-.76.29-1.05 0L15 14m-6 4v2m-6 0v-2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 10h12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7z"
          />
        </svg>
      );
    }
    if (mimeType.includes("pdf")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    }
    if (
      mimeType.includes("spreadsheet") ||
      mimeType.includes("excel") ||
      mimeType.includes("csv")
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    }
    // Default for other documents
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0010.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    );
  };

  // Filter users for the "New message" modal based on searchTerm
  const filteredUsers = chatUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleUserSelect(id: string): void {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  }

  function handleContinueChat(): void {
    if (selectedUsers.length === 0) return;

    setIsNewChatModalOpen(false);
    setSelectedUsers([]);
    setSearchTerm("");
    setIsChatExpanded(true);
  }

  return (
    <div className="relative min-h-screen w-full bg-gray-50 font-sans antialiased flex justify-end items-end p-4">
      {/* Initial Chat Button */}
      <AnimatePresence>
        {!isChatExpanded && (
          <motion.button
            key="chat-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsChatExpanded(true)}
            className="fixed bottom-8 right-8 p-4 rounded-full bg-custom-primary text-white shadow-lg
                       hover:bg-custom-primary-dark focus:outline-none focus:ring-4 focus:ring-custom-primary-light z-50 flex items-center justify-center"
            aria-label="Open chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window container */}
      <AnimatePresence>
        {isChatExpanded && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, x: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-8 right-8 w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden flex flex-col h-[600px] border border-gray-200 z-40"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
              <div className="flex items-center space-x-3">
                {/* Dynamically display an avatar for the chat sender (e.g., the first available user) */}
                {chatUsers.length > 0 && (
                  <Image
                    src={chatUsers[0].avatar || DefaultAvatarPlaceholder}
                    alt={`${chatUsers[0].name} Avatar`}
                    className="w-10 h-10 rounded-full border border-gray-200"
                    width={40}
                    height={40}
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-800 text-base">
                    {chatUsers.length > 0 ? chatUsers[0].name : "Chat User"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {chatUsers.length > 0 ? chatUsers[0].email : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Minimize Button */}
                <button
                  onClick={() => setIsChatExpanded(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Minimize chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {/* Plus Button to open new chat modal */}
                <button
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="New message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 custom-scrollbar">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() =>
                    index !== messages.length - 1 && setHoveredMessageId(msg.id)
                  }
                  onMouseLeave={() =>
                    index !== messages.length - 1 && setHoveredMessageId(null)
                  }
                  className={`relative flex flex-col ${
                    msg.isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-lg shadow-sm text-base flex flex-col ${
                      msg.isUser
                        ? "bg-custom-user-bubble text-gray-900 rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                    }`}
                  >
                    {msg.text && <span>{msg.text}</span>}
                    {msg.attachment && (
                      <div className={`mt-2 ${msg.text ? "" : "mb-1"}`}>
                        {msg.attachment.type.startsWith("image/") && (
                          <div className="max-w-full h-auto  max-h-[150px] relative">
                            <Image
                              src={msg.attachment.url}
                              alt={msg.attachment.name}
                              fill
                              className="rounded-md object-cover cursor-pointer"
                              onClick={() =>
                                window.open(msg.attachment.url, "_blank")
                              }
                            />
                          </div>
                        )}
                        {msg.attachment.type.startsWith("video/") && (
                          <video
                            src={msg.attachment.url}
                            controls
                            className="rounded-md max-w-full h-auto object-cover max-h-[150px]"
                          />
                        )}
                        {!(
                          msg.attachment.type.startsWith("image/") ||
                          msg.attachment.type.startsWith("video/")
                        ) && (
                          <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md text-gray-800">
                            {getFileIcon(msg.attachment.type)}
                            <span className="text-sm truncate max-w-[calc(100%-30px)]">
                              {msg.attachment.name}
                            </span>
                            <a
                              href={msg.attachment.url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-custom-primary hover:underline"
                              aria-label={`Download ${msg.attachment.name}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    <span
                      className={`text-xs mt-1 ${
                        msg.isUser ? "text-gray-700" : "text-gray-500"
                      } self-end`}
                    >
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>

                  {/* Viewers Section (on hover, or always visible for the last message for preview) */}
                  <AnimatePresence>
                    {(hoveredMessageId === msg.id ||
                      index === messages.length - 1) &&
                      msg.viewedBy &&
                      msg.viewedBy.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute mt-1 top-full flex items-center text-[0.65rem] text-gray-600 z-10 ${
                            msg.isUser ? "right-0" : "left-0"
                          }`}
                        >
                          <span className="mr-1">Viewed by</span>
                          <div className="flex -space-x-[2px] overflow-hidden">
                            {msg.viewedBy
                              .slice(0, 3)
                              .map((viewerId, vIndex) => {
                                const viewer = getChatUserDetails(viewerId);
                                return viewer ? (
                                  <motion.img
                                    key={viewer.id}
                                    src={viewer.avatar}
                                    alt={viewer.name}
                                    className="w-5 h-5 rounded-full border border-white bg-gray-200"
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: vIndex * 0.05 }}
                                  />
                                ) : null;
                              })}
                          </div>
                          {msg.viewedBy.length > 3 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewersToDisplayInModal(
                                  msg.viewedBy
                                    .map((id) => getChatUserDetails(id))
                                    .filter(Boolean) as ChatUser[]
                                );
                              }}
                              className="ml-1 text-custom-primary hover:underline focus:outline-none focus:ring-2 focus:ring-custom-primary-light rounded-md px-1 py-0.5 text-[0.6rem]"
                            >
                              +{msg.viewedBy.length - 3} more
                            </button>
                          )}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white z-10">
              {attachedFile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg mb-3"
                >
                  {attachedFile.type.startsWith("image/") && (
                    <Image
                      src={attachedFile.url}
                      alt="Attached preview"
                      className="w-10 h-10 object-cover rounded-md"
                      width={40}
                      height={40}
                    />
                  )}
                  {attachedFile.type.startsWith("video/") && (
                    <video
                      src={attachedFile.url}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                  )}
                  {!(
                    attachedFile.type.startsWith("image/") ||
                    attachedFile.type.startsWith("video/")
                  ) && getFileIcon(attachedFile.type)}
                  <span className="text-sm font-medium text-gray-700 truncate flex-1">
                    {attachedFile.name}
                  </span>
                  <button
                    onClick={clearAttachedFile}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Remove attached file"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </motion.div>
              )}
              <div className="flex items-center relative">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  aria-hidden="true"
                />
                {/* Attachment Button */}
                <button
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-2"
                  aria-label="Attach file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a3 3 0 00-4.242-4.242L9.829 5.172a3 3 0 00-4.242 0L3.75 6.25m9.586 6.586l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a3 3 0 00-4.242-4.242L9.829 17.172a3 3 0 00-4.242 0L3.75 18.25"
                    />
                  </svg>
                </button>

                {/* Contenteditable div for chat input */}
                <div
                  ref={chatInputRef}
                  contentEditable="true"
                  onInput={handleChatInput}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light text-gray-700 placeholder-gray-400 text-base overflow-y-auto max-h-24 min-h-[42px] leading-tight"
                  suppressContentEditableWarning={true}
                  data-placeholder="Type your message..."
                ></div>

                {/* Mention Suggestion Box */}
                <AnimatePresence>
                  {showMentions && filteredMentions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.1 }}
                      className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-20"
                    >
                      {filteredMentions.map((user, index) => (
                        <div
                          key={user.id}
                          className={`flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-100 ${
                            index === selectedMentionIndex
                              ? "bg-custom-primary-lightest"
                              : ""
                          }`}
                          onClick={() => insertMention(user)}
                        >
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            className="w-7 h-7 rounded-full"
                            width={28}
                            height={28}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleSendMessage}
                  className="ml-3 p-3 rounded-full bg-custom-primary text-white hover:bg-custom-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-custom-primary-light"
                  aria-label="Send message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Message Modal */}
      <AnimatePresence>
        {isNewChatModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm flex flex-col space-y-4 border border-gray-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  New message
                </h2>
                <button
                  onClick={() => setIsNewChatModalOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-500">
                Invite a user to this thread. This will create a new group
                message.
              </p>

              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search user..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-primary-light text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto max-h-60 space-y-2 py-2 custom-scrollbar">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => handleUserSelect(user.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Image
                          src={user.avatar}
                          alt={`${user.name} Avatar`}
                          className="w-8 h-8 rounded-full border border-gray-100"
                          width={32}
                          height={32}
                        />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-custom-primary text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No users found.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex -space-x-2 overflow-hidden">
                  {selectedUsers.slice(0, 3).map((userId) => {
                    const user = getChatUserDetails(userId);
                    return user ? (
                      <motion.img
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        src={user.avatar}
                        alt={`${user.name} Avatar`}
                        className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
                      />
                    ) : null;
                  })}
                  {selectedUsers.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium">
                      +{selectedUsers.length - 3}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleContinueChat()}
                  className="px-6 py-2 bg-custom-primary text-white font-semibold rounded-lg hover:bg-custom-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-custom-primary-light"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View All Viewers Modal (Dynamic Content) */}
      <AnimatePresence>
        {viewersToDisplayInModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm flex flex-col space-y-4 border border-gray-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  People who viewed this message
                </h2>
                <button
                  onClick={() => setViewersToDisplayInModal(null)}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
                  aria-label="Close viewers modal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-80 space-y-3 py-2 custom-scrollbar">
                {viewersToDisplayInModal &&
                viewersToDisplayInModal.length > 0 ? (
                  viewersToDisplayInModal.map(
                    (
                      viewer: ChatUser // Type can be ChatUser
                    ) => (
                      <motion.div
                        key={viewer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <Image
                          src={viewer.avatar}
                          alt={`${viewer.name} Avatar`}
                          className="w-10 h-10 rounded-full border border-gray-100"
                          width={40}
                          height={40}
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {viewer.name}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {viewer.email}
                          </p>
                        </div>
                      </motion.div>
                    )
                  )
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No one has viewed this message yet.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* Define custom CSS variables for your theme colors */
        :root {
            --color-primary: #5C5CE9;
            --color-primary-dark: #4A4ACD; /* Slightly darker for hover */
            --color-primary-light: #A4A7F4; /* Lighter for focus rings */
            --color-primary-lightest: #E7E7FD; /* Very light for mention highlight */

            --color-secondary: #F178B6; /* Pink accent */
            --color-user-bubble: #A4A7F4; /* Lighter purple/blue for user messages */
            --color-mention-bg: #F178B6; /* Using your secondary color for mention background */
            --color-mention-text: #FFFFFF; /* White text for contrast on pink background */
        }

        /* Apply custom colors using CSS variables in Tailwind-like classes */
        .bg-custom-primary { background-color: var(--color-primary); }
        .hover\\:bg-custom-primary-dark:hover { background-color: var(--color-primary-dark); }
        .focus\\:ring-custom-primary-light:focus { --tw-ring-color: var(--color-primary-light); }
        .text-custom-primary { color: var(--color-primary); }
        .bg-custom-user-bubble { background-color: var(--color-user-bubble); }
        .bg-custom-primary-lightest { background-color: var(--color-primary-lightest); }

        /* Styling for the contenteditable div to look like an input and handle placeholder */
        [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af; /* Tailwind gray-400 */
            pointer-events: none;
            display: block; /* Ensures it works across browsers */
        }

        /* Basic styling for the mention bubble */
        .mention-bubble {
            display: inline-flex;
            align-items: center;
            border-radius: 9999px; /* full rounded */
            padding-left: 0.5rem; /* px-2 */
            padding-right: 0.5rem; /* px-2 */
            padding-top: 0.125rem; /* py-0.5 */
            padding-bottom: 0.125rem; /* py-0.5 */
            font-size: 0.875rem; /* text-sm */
            line-height: 1.25rem; /* text-sm default line-height */
            font-weight: 500; /* font-medium */
            background-color: var(--color-mention-bg); /* Use defined mention background */
            color: var(--color-mention-text); /* Use defined mention text color */
            cursor: pointer;
            user-select: none; /* important for preventing selection issues */
            vertical-align: middle; /* Align with text baseline */
            margin-right: 0.25rem; /* Small margin for spacing */
            margin-left: 0.25rem; /* Small margin for spacing */
        }
      `}</style>
    </div>
  );
}
