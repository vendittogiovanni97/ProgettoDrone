import { serverConfig } from "../config/fetchUrl";

export const backendFetch = async (
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
    const fetchResult = await fetch(
      `${serverConfig.basePath}${serverConfig.basePort}${serverConfig.baseRest}${url}`,
      fetchOptions
    );

    const responseBody = await fetchResult.json();
    const responseDetails= responseBody.details
    //console.log("RESPONSE FETCH ", fetchResult, responseBody);

    return { fetchResult, responseBody, responseDetails };
  } catch (error) {
    throw new Error(`Errore nella fetch: ${error}`);
  }
};
