import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

type RequestOptions = Omit<RequestInit, "headers" | "body"> & {
  body?: any; 
};

export const useApi = () => {
  const { getToken } = useAuth();

  const makeRequest = useCallback(async (endpoint: string, options: RequestOptions = {}) => {
    try {
      const token = await getToken();

      const isFormData = options.body instanceof FormData;
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      };

      const body = !isFormData && options.body ? JSON.stringify(options.body) : options.body;

      const response = await fetch(`http://192.168.29.19:8000/api/${endpoint}`, {
        ...options,
        headers,
        body,
      });

      if (!response.ok) {
        let errorMessage = "An error occurred";
        try {
          const errorData = await response.json();
          errorMessage =
            errorData?.detail
              ? typeof errorData.detail === "string"
                ? errorData.detail
                : JSON.stringify(errorData.detail)
              : errorMessage;
        } catch (e) {}

        if (response.status === 429) {
          throw new Error("Daily quota exceeded");
        }

        throw new Error(errorMessage);
      }

      return response.json();
    } catch (err: any) {
      console.error("API request error:", err);
      throw new Error(err.message || "Unknown API error");
    }
  }, [getToken]); // <- depends on getToken

  return { makeRequest };
};
