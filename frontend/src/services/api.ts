/* eslint-disable @typescript-eslint/no-unused-vars */
const baseUrlVariabile = {
  path: "https://b194-93-150-201-244.ngrok-free.app/rest/mqtt",
};

const baseUrl = {
  path: "http://localhost:8081/rest/mqtt",
};

export const backendFetchDrones = async (
  url: string,
  method: "get" | "post" | "delete" | "put" = "get",
  body?: unknown
) => {
  const fetchOptions: RequestInit =
    method === "post"
      ? {
          method: method,
          body: JSON.stringify(body),
          headers: { "content-type": "application/json" },
          credentials: "include",
        }
      : {
          credentials: "include",
        };

  try {
    //console.log("INVIO FETCH ");
    const fetchResult = await fetch(`${baseUrl.path}${url}`, fetchOptions);

    const responseBody = await fetchResult.json();
    const responseDetails = responseBody.details;
    console.log("RESPONSE FETCH ", fetchResult, responseBody);

    return { fetchResult, responseBody, responseDetails };
  } catch (error) {
    throw new Error(`Errore nella fetch: ${error}`);
  }
};
