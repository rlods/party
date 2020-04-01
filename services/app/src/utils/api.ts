import Axios from "axios";

// ------------------------------------------------------------------

type SearchResult<T> = {
  data: T[];
  total: number;
};

export type SearchAllResults = {
  albums: SearchResult<ApiAlbum>;
  playlists: SearchResult<ApiPlaylist>;
  tracks: SearchResult<ApiTrack>;
};

export type ApiAlbum = {
  artist: {
    id: number;
    name: string;
    link: string;
    picture_big: string;
    picture_small: string;
  };
  available: boolean;
  cover_big: string;
  cover_small: string;
  id: number;
  link: string;
  nb_tracks: number;
  title: string;
  tracks?: { data: ApiTrack[] };
  type: "album";
};

export type ApiPlaylist = {
  description: string;
  id: number;
  link: string;
  nb_tracks: number;
  picture_big: string;
  picture_small: string;
  public: true;
  title: string;
  tracks?: { data: ApiTrack[] };
  type: "playlist";
};

export type ApiTrack = {
  album: {
    id: number;
    title: string;
    cover_big: string;
    cover_small: string;
  };
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
  readable: boolean;
  title: string;
  type: "track";
};

// ------------------------------------------------------------------

export const Api = () => {
  const API_BASE = "https://api.deezer.com";

  const search = async <T>(type: string, query: string) =>
    (
      await Axios.get(
        `${API_BASE}/search/${type}?q=${encodeURIComponent(query)}`,
        {}
      )
    ).data as SearchResult<T>;

  const load = async <T>(type: string, id: string) =>
    (await Axios.get(`${API_BASE}/${type}/${id}`, {})).data as T;

  const searchAlbums = (query: string) => search<ApiAlbum>("album", query);

  const searchPlaylists = (query: string) =>
    search<ApiPlaylist>("playlist", query);

  const searchTracks = (query: string) => search<ApiTrack>("track", query);

  const searchAll = async (query: string): Promise<SearchAllResults> => {
    const [albums, playlists, tracks] = await Promise.all([
      searchAlbums(query),
      searchPlaylists(query),
      searchTracks(query)
    ]);
    return { albums, playlists, tracks };
  };

  const loadAlbum = async (id: string) => {
    const album = await load<ApiAlbum>("album", id);
    album.tracks!.data.forEach(track => (track.album = album));
    return album;
  };

  const loadPlaylist = (id: string) => load<ApiPlaylist>("playlist", id);

  const loadTrack = (id: string) => load<ApiTrack>("track", id);

  return {
    searchAll,
    loadAlbum,
    loadPlaylist,
    loadTrack
  };
};

// ------------------------------------------------------------------

export const DEFAULT_API = Api();
