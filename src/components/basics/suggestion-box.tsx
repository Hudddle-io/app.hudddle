"use client";

import fetchSuggestions from "@/lib/fetch-suggestions";
import React from "react";
import Image from "next/image";

interface UserSuggestion {
  id: string; // Or number, depending on your backend
  full_name: string;
  email: string;
  avatar_url?: string; // Optional, if not all users have an avatar
}

interface SuggestionBoxProps {
  value: string; // The initial value for the input, now controlled by parent
  onSuggestionSelect: (email: string) => void; // New prop: callback for when a suggestion is selected
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({
  value,
  onSuggestionSelect,
}) => {
  const [suggestions, setSuggestions] = React.useState<UserSuggestion[]>([]);
  // inputValue here acts as the internal state for the SuggestionBox's input field,
  // which drives the search. It's initialized from the 'value' prop.
  const [inputValue, setInputValue] = React.useState(value);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Sync internal inputValue with external 'value' prop
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Effect for fetching suggestions based on inputValue
  React.useEffect(() => {
    const fetchAndSetSuggestions = async () => {
      if (!inputValue || inputValue.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      setShowSuggestions(true);

      try {
        const newSuggestions: UserSuggestion[] = await fetchSuggestions(
          [inputValue],
          "api/v1/friends/friends"
        );
        setSuggestions(newSuggestions);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchAndSetSuggestions();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const handleFocus = () => {
    if (
      inputValue.length >= 2 ||
      (suggestions.length > 0 && inputValue.length > 0)
    ) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding to allow click events on suggestions to register
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const handleSuggestionClick = (email: string) => {
    onSuggestionSelect(email); // Call the parent's callback with the selected email
    setSuggestions([]); // Clear suggestions
    setShowSuggestions(false); // Hide the suggestion list immediately
  };

  return (
    <div className="relative w-full z-50">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search suggestions..."
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full hidden"
      />

      {showSuggestions &&
        (isLoading || suggestions.length > 0 || inputValue.length >= 2) && ( // Show if loading, or if there are suggestions, or if input is long enough to have searched
          <ul className="absolute z-10 w-full border border-gray-300 rounded-lg mt-1 max-h-64 overflow-y-auto bg-white shadow-lg">
            {isLoading ? (
              <li className="p-4 text-center text-gray-500">
                Loading suggestions...
              </li>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion.email)} // Attach click handler
                >
                  <Image
                    src={suggestion.avatar_url || suggestion.full_name}
                    alt={suggestion.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {suggestion.full_name}
                    </p>
                    <p className="text-sm text-gray-500">{suggestion.email}</p>
                  </div>
                </li>
              ))
            ) : (
              inputValue.length >= 2 && (
                <li className="p-4 text-center text-gray-500">
                  No suggestions found.
                </li>
              )
            )}
          </ul>
        )}
    </div>
  );
};

export default SuggestionBox;
