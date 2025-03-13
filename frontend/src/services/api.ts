const baseUlr = {
  path: "https://fa2a-2001-b07-6469-af00-951a-4c69-dcc4-814b.ngrok-free.app/rest",
};

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
    const fetchResult = await fetch(`${baseUlr.path}${url}`, fetchOptions);

    const responseBody = await fetchResult.json();
    const responseDetails = responseBody.details;
    console.log("RESPONSE FETCH ", fetchResult, responseBody);

    return { fetchResult, responseBody, responseDetails };
  } catch (error) {
    throw new Error(`Errore nella fetch: ${error}`);
  }
};
