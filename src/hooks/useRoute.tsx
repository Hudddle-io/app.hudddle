"use client";

// Update the export to provide a function that returns the router instance
export const getRouter = () => require("next/navigation").useRouter();
