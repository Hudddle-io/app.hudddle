import { backendUri } from "@/lib/config";
import { toast } from "../components/ui/use-toast";

export default async function fetchSuggestions(data: any[], api: string) {
  if (!api) {
    console.error("fetchSuggestions Error: No endpoint provided.");
    throw new Error("There is no endpoint to fetch suggestions");
  }
  // Ensure data is an array before processing
  if (!data || !Array.isArray(data)) {
    console.error(
      "fetchSuggestions Error: Invalid data provided for suggestions. Expected an array, got:",
      data
    );
    throw new Error("Invalid data provided for suggestions");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    console.error(
      "fetchSuggestions Error: Authorization token not found in localStorage."
    );
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    // Construct query parameters from the 'data' array
    const queryParams = new URLSearchParams();
    data.forEach((item, index) => {
      // Assuming 'data' contains the search term(s).
      // You might want to adjust the query parameter name (e.g., 'q', 'search').
      // For simplicity, we'll use 'query' and convert each item to a string.
      queryParams.append("query", item.toString());
    });

    // Construct the URL with query parameters
    const url = `${backendUri}/${api}?${queryParams.toString()}`;

    console.log("fetchSuggestions: Attempting to fetch from:", url);
    console.log("fetchSuggestions: Using method: GET");
    console.log("fetchSuggestions: With headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // IMPORTANT: Removed 'body' for GET requests
      // body: JSON.stringify({ data }), // This line is removed
    });

    console.log(
      "fetchSuggestions: Received response status:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      // Attempt to read error body if available
      const errorBody = await response.text();
      console.error(
        "fetchSuggestions Error: Server responded with non-OK status. Details:",
        errorBody
      );
      throw new Error(
        `Failed to fetch suggestions. Server responded with status ${
          response.status
        }: ${errorBody || response.statusText}`
      );
    }

    const suggestions = await response.json();
    console.log(
      "fetchSuggestions: Successfully fetched suggestions:",
      suggestions
    );
    return suggestions;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while fetching suggestions.";

    console.error("fetchSuggestions Catch Block Error:", error);

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    // Re-throw the error so calling components can also handle it
    throw new Error("Failed to fetch suggestions: " + errorMessage);
  }
}
