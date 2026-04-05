import api from "../lib/axios";

//GET all music
export const getAllMusic = async (page = 1, limit = 20) => {
  const response = await api.get(`/music?_page=${page}&_limit=${limit}`);
  return response.data.data;
};

//GET all albums
export const getAllAlbums = async (page = 1, limit = 20) => {
  const response = await api.get(`/music/album?_page=${page}&_limit=${limit}`);
  console.log(response.data.data);

  return response.data.data;
};

//GET album by id
export const getAlbumById = async (id) => {
  const response = await api.get(`/music/album/${id}`);

  return response.data.data;
};

//SEARCH music
export const searchMusic = async (query, page = 1, limit = 20) => {
  console.log("SEARCH MUSIC QUERY");
  const response = await api.get(
    `/music/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
  );
  console.log(response.data);
  return response.data;
};

//SEARCH album
export const searchAlbum = async (query, page = 1, limit = 20) => {
  const response = await api.get(
    `/music/album/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
  );
  return response.data;
};
