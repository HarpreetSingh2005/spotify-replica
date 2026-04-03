import api from "../lib/axios";

//GET all music
export const getAllMusic = async (page = 1, limit = 10) => {
  const response = await api.get(`/music?_page=${page}&_limit=${limit}`);
  return response.data.data;
};

//GET all albums
export const getAllAlbums = async (page = 1, limit = 10) => {
  const response = await api.get(`/music/album?_page=${page}&_limit=${limit}`);
  console.log(response.data.data);

  return response.data.data;
};

//GET music by id
export const getMusicById = async (id) => {
  const response = await api.get(`/music/${id}`);

  return response.data;
};

//GET album by id
export const getAlbumById = async (id) => {
  const response = await api.get(`/music/album/${id}`);

  return response.data.data;
};
