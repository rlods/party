import Axios from "axios";

// ------------------------------------------------------------------

const API_BASE = "https://api.deezer.com";

type SearchResult<T> = {
  data: T[];
  total: number;
};

export const search = async <T>(type: string, query: string) =>
  (
    await Axios.get(
      `${API_BASE}/search/${type}?q=${encodeURIComponent(query)}`,
      {}
    )
  ).data as SearchResult<T>;

export const load = async <T>(type: string, id: string) =>
  (await Axios.get(`${API_BASE}/${type}/${id}`, {})).data as T;

// ------------------------------------------------------------------

export type SearchAlbumItem = {
  artist: {
    id: number;
    name: string;
    link: string;
    picture_big: string;
    picture_small: string;
  };
  cover_big: string;
  cover_small: string;
  id: number;
  link: string;
  nb_tracks: number;
  title: string;
  type: "album";
};

export const searchAlbums = (query: string) =>
  search<SearchAlbumItem>("album", query);

// ------------------------------------------------------------------

export type SearchPlaylistItem = {
  id: number;
  link: string;
  nb_tracks: number;
  picture_big: string;
  picture_small: string;
  public: true;
  title: string;
  type: "playlist";
};

export const searchPlaylists = (query: string) =>
  search<SearchPlaylistItem>("playlist", query);

// ------------------------------------------------------------------

export type SearchTrackItem = {
  album: { id: number; title: string; cover_big: string; cover_small: string };
  artist: {
    id: number;
    name: string;
    link: string;
    picture_big: string;
    picture_small: string;
  };
  duration: number;
  id: number;
  link: string;
  preview: string;
  title: string;
  type: "track";
};

export const searchTracks = (query: string) =>
  search<SearchTrackItem>("track", query);

// ------------------------------------------------------------------

export type SearchAllResults = {
  albums: SearchResult<SearchAlbumItem>;
  playlists: SearchResult<SearchPlaylistItem>;
  tracks: SearchResult<SearchTrackItem>;
};

export const searchAll = async (query: string): Promise<SearchAllResults> => {
  const [albums, playlists, tracks] = await Promise.all([
    searchAlbums(query),
    searchPlaylists(query),
    searchTracks(query)
  ]);
  return { albums, playlists, tracks };
};

// ------------------------------------------------------------------

export type LoadAlbumItem = {
  artist: {
    id: number;
    name: string;
    link: string;
    picture_big: string;
    picture_small: string;
  };
  cover_big: string;
  cover_small: string;
  id: number;
  link: string;
  nb_tracks: number;
  title: string;
  tracks: { data: LoadTrackItem[] };
  type: "album";
};

export const loadAlbum = (id: string) => load<LoadAlbumItem>("Album", id);

// ------------------------------------------------------------------

export type LoadPlaylistItem = {
  description: string;
  id: number;
  link: string;
  nb_tracks: number;
  picture_big: string;
  picture_small: string;
  public: true;
  title: string;
  tracks: { data: LoadTrackItem[] };
  type: "playlist";
};

export const loadPlaylist = (id: string) =>
  load<LoadPlaylistItem>("playlist", id);

// ------------------------------------------------------------------

export type LoadTrackItem = {
  album: { id: number; title: string; cover_big: string; cover_small: string };
  artist: {
    id: number;
    name: string;
    link: string;
    picture_big: string;
    picture_small: string;
  };
  duration: number;
  id: number;
  link: string;
  preview: string;
  title: string;
  type: "track";
};

export const loadTrack = (id: string) => load<LoadTrackItem>("track", id);
