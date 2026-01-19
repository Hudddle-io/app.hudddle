"use client";

import fetchSuggestions from "@/lib/fetch-suggestions";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const DefaultAvatarPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

interface UserSuggestion {
  id: string;
  first_name: string; // Changed from full_name
  last_name: string; // Added last_name
  email: string;
  avatar_url?: string;
}

interface SuggestionBoxProps {
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
  onSuggestionSelect: (email: string) => void;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({
  className,
  value,
  onValueChange,
  onSuggestionSelect,
}) => {
  const [allPossibleSuggestions, setAllPossibleSuggestions] = React.useState<
    UserSuggestion[]
  >([]);
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<
    UserSuggestion[]
  >([]);
  const [inputValue, setInputValue] = React.useState(value);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Sync internal inputValue with external 'value' prop
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Effect to fetch ALL possible suggestions once on component mount
  React.useEffect(() => {
    const fetchAllSuggestions = async () => {
      setIsLoading(true);
      try {
        const allSuggestions: UserSuggestion[] = await fetchSuggestions(
          [],
          "api/v1/friends/friends"
        );
        setAllPossibleSuggestions(allSuggestions);
      } catch (err) {
        console.error("Error fetching all possible suggestions:", err);
        setAllPossibleSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSuggestions();
  }, []);

  // Effect to filter suggestions whenever inputValue or allPossibleSuggestions changes
  React.useEffect(() => {
    if (!allPossibleSuggestions.length && !isLoading) {
      setFilteredSuggestions([]);
      return;
    }

    // If input is empty, show all suggestions
    if (!inputValue) {
      setFilteredSuggestions(allPossibleSuggestions);
      return;
    }

    const lowerCaseInput = inputValue.toLowerCase();

    const newFilteredSuggestions = allPossibleSuggestions.filter(
      (suggestion) => {
        // Create a combined full name for filtering
        const fullName =
          `${suggestion.first_name} ${suggestion.last_name}`.toLowerCase();
        const email = suggestion.email.toLowerCase();

        const matchesName = fullName.includes(lowerCaseInput);
        const matchesEmail = email.includes(lowerCaseInput);

        return matchesName || matchesEmail;
      }
    );

    setFilteredSuggestions(newFilteredSuggestions);
  }, [inputValue, allPossibleSuggestions, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange(newValue);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const handleSuggestionClick = (email: string) => {
    onSuggestionSelect(email);
    setFilteredSuggestions([]);
    setInputValue(email);
    setShowSuggestions(false);
  };

  const shouldShowDropdown =
    showSuggestions &&
    (isLoading || filteredSuggestions.length > 0 || inputValue.length >= 2);

  return (
    <div className={cn("relative max-w-[500px] w-full z-50", className)}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search"
        className="px-3 h-[42px] border border-slate-200 rounded-md w-full"
      />

      {shouldShowDropdown && (
        <ul className="absolute z-50 w-full border border-gray-300 rounded-lg mt-1 max-h-64 overflow-y-auto bg-white shadow-lg">
          {isLoading ? (
            <li className="p-4 text-center text-gray-500">
              Loading all possible friends...
            </li>
          ) : filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion.email)}
              >
                <Image
                  src={suggestion.avatar_url || DefaultAvatarPlaceholder}
                  alt={`${suggestion.first_name} ${suggestion.last_name}`} // Updated alt text
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {`${suggestion.first_name} ${suggestion.last_name}`}
                  </p>
                  <p className="text-sm text-gray-500">{suggestion.email}</p>
                </div>
              </li>
            ))
          ) : (
            inputValue.length >= 2 &&
            !isLoading && (
              <li className="p-4 text-center text-gray-500">
                No matching friends found.
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default SuggestionBox;
