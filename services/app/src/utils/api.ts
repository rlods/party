// import Axios from "axios";
import jsonp from "jsonp";

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

  const asyncJsonp = <T>(url: string): Promise<T> =>
    new Promise((resolve, reject) => {
      jsonp(url, void 0, (err, data) => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve(data);
        }
      });
    });

  const call = async <T>(path: string, qs?: string) => {
    // We have to rely on jsonp because the Deezer api is CORS restricted
    const fullpath = qs
      ? `${API_BASE}/${path}?${qs}&output=jsonp&callback=`
      : `${API_BASE}/${path}?output=jsonp&callback=`;
    return await asyncJsonp<T>(fullpath);
  };

  const search = <T>(type: string, query: string) =>
    call<SearchResult<T>>(`search/${type}`, `q=${encodeURIComponent(query)}`);

  const load = <T>(type: string, id: string) => call<T>(`/${type}/${id}`);

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
