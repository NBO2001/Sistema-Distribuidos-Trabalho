import { TSongCreate, TSongRemove } from "../App";
import api from "./api";


export const getSongs = async () => {

  try{
    const { data } = await api.get("/songs?bd=3");
    return data;

  }catch(err){
    throw err
  }
}

export const insertSongs = async ({title, to}: TSongCreate) => {

  try{
    const { data } = await api.post(`/songs?bd=${to}`, {title});
    return data;

  }catch(err){
    throw err
  }
}

export const deleteSongs = async ({id, from}: TSongRemove) => {

  try{
    const { data } = await api.delete(`/songs/${id}?bd=${from}`);
    return data;

  }catch(err){
    throw err
  }
}

// export const getMusicStreaming = async (idMusic: string) => {
//   const response = await api.get(`/music/${idMusic}`, {
//     responseType: "blob",
//   });
//   const title = response.headers["content-title"];
//   const artist = response.headers["content-artist"];

//   return { data: response.data, title, artist };
// };

// export const getMusicSearch = async (query: string) => {
//   try {
//     const response = await api.post("/music/search", { query });
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };
