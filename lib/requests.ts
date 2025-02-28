import axios from "axios";

const DATABASE_INTERFACE_BEARER_TOKEN = "password";
export const BASE_URL = "http://50.192.114.102:8080/";

export const ask = async (queryPrompt: string, filter: string[]) => {
  const debugMode = new URLSearchParams(window.location.search).has('debug');
  if (debugMode){console.log("sending query")}
  const url = BASE_URL + "ask";
  const headers = {
    "Content-Type": "application/json",
    "accept": "application/json",
    "Authorization": `Bearer ${DATABASE_INTERFACE_BEARER_TOKEN}`,
  };
  let filterRequest = {};
  filterRequest = { "author": JSON.stringify(filter) };


  // The API only accepts one query at a time, but Chroma (& pinecone) can do multiple.
  const data = { "queries": [{ "query": queryPrompt, "top_k": 3, "filter": filterRequest }] };
  console.log(data);

  const response = await axios.post(url, data, { headers });

  if (response.status === 200) {
    if (debugMode){console.log(JSON.stringify(response.data, null, 2))}
    return response.data;
  } else {
    throw new Error(`Error: ${response.status} : ${response.data}`);
  }
};

export const rawAsk = async (queryPrompt: string, filter: string[]) => {
  const debugMode = new URLSearchParams(window.location.search).has('debug');
  if (debugMode){console.log("sending query")}
  const url = BASE_URL + "rawAsk";
  const headers = {
    "Content-Type": "application/json",
    "accept": "application/json",
    "Authorization": `Bearer ${DATABASE_INTERFACE_BEARER_TOKEN}`,
  };
  let filterRequest = {};
  filterRequest = { "author": JSON.stringify(filter) };


  // The API only accepts one query at a time, but Chroma (& pinecone) can do multiple.
  const data = { "queries": [{ "query": queryPrompt, "top_k": 3, "filter": filterRequest }] };
  console.log(data);

  const response = await axios.post(url, data, { headers });

  if (response.status === 200) {
    if (debugMode){console.log(JSON.stringify(response.data, null, 2))}
    return response.data;
  } else {
    throw new Error(`Error: ${response.status} : ${response.data}`);
  }
};


// The rest are no longer used, logic moved to backend and accessed via ask function

export const queryDatabase = async (queryPrompt: string, filter: number) => {
  console.log("querying database")
  const url = BASE_URL + "query";
  const headers = {
    "Content-Type": "application/json",
    "accept": "application/json",
    "Authorization": `Bearer ${DATABASE_INTERFACE_BEARER_TOKEN}`,
  };
  let filterRequest = {};
  if (filter === 0) {
    filterRequest = { "author": "BindPlane OP Docs" };
  }
  if (filter === 1) {
    filterRequest = { "author": "OpenTelemetry Docs" };
  }

  const data = { "queries": [{ "query": queryPrompt, "top_k": 3, "filter": filterRequest }] };

  const response = await axios.post(url, data, { headers });

  if (response.status === 200) {
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } else {
    throw new Error(`Error: ${response.status} : ${response.data}`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getChunks = (chunksResponse: any) => {
  const chunks: string[] = [];
  for (const result of chunksResponse.results) {
    for (const innerResult of result.results) {
      chunks.push(innerResult.text);
    }
  }
  return chunks;
};