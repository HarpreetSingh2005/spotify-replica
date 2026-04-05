import api from "../lib/axios";

//GET all music
export const getAllMusic = async (page = 1, limit = 10) => {
  const response = await api.get(`/music?page=${page}&limit=${limit}`);
  return response.data.data;
};

//GET all albums
export const getAllAlbums = async (page = 1, limit = 10) => {
  const response = await api.get(`/music/album?page=${page}&limit=${limit}`);

  return response.data.data;
};

//GET album by id
export const getAlbumById = async (id) => {
  const response = await api.get(`/music/album/${id}`);

  return response.data.data;
};

//SEARCH music
export const searchMusic = async (query, page = 1, limit = 10) => {
  const response = await api.get(
    `/music/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
  );
  return response.data.data;
};

//SEARCH album
export const searchAlbum = async (query, page = 1, limit = 10) => {
  const response = await api.get(
    `/music/album/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
  );
  return response.data.data;
};
