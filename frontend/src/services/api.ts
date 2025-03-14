/* eslint-disable @typescript-eslint/no-unused-vars */
const baseUrlVariabile = {
  path: "http://192.168.7.61:8081/rest/mqtt",
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
          //credentials: "include",
        }
      : {
          //credentials: "include",
        };

  try {
    //console.log("INVIO FETCH ");
    const fetchResult = await fetch(
      `${baseUrlVariabile.path}${url}`,
      fetchOptions
    );

    const responseBody = await fetchResult.json();
    const responseDetails = responseBody.details;
    console.log("RESPONSE FETCH ", fetchResult, responseBody);

    return { fetchResult, responseBody, responseDetails };
  } catch (error) {
    throw new Error(`Errore nella fetch: ${error}`);
  }
};
