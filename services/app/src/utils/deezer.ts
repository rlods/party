// import Axios from "axios";
import jsonp from "jsonp";
//
import {
  SearchAllResults,
  SearchResult,
  Album,
  Playlist,
  Track,
} from "./medias";

// ------------------------------------------------------------------

export type ApiAlbum = {
  artist: {
    id: number;
    name: string;
    picture_big: string;
    picture_small: string;
  };
  available: boolean;
  cover_big: string;
  cover_small: string;
  id: number;
  title: string;
  tracks?: { data: ApiTrack[] };
};

export type ApiPlaylist = {
  id: number;
  picture_big: string;
  picture_small: string;
  public: true;
  title: string;
  tracks?: { data: ApiTrack[] };
  user: {
    id: number;
    name: string;
  };
};

export type ApiTrack = {
  album: {
    cover_big: string;
    cover_small: string;
    id: number;
    title: string;
  };
  artist: {
    id: number;
    name: string;
    picture_big: string;
    picture_small: string;
  };
  duration: number;
  id: number;
  preview: string;
  readable: boolean;
  title: string;
};

// ------------------------------------------------------------------

const ConvertAlbum = (album: ApiAlbum): Album => ({
  artist: {
    id: album.artist.id.toString(),
    name: album.artist.name,
    link: `https://www.deezer.com/artist/${album.artist.id}`,
    picture_big: album.artist.picture_big,
    picture_small: album.artist.picture_small,
  },
  cover_big: album.cover_big,
  cover_small: album.cover_small,
  id: album.id.toString(),
  link: `https://www.deezer.com/album/${album.id}`,
  title: album.title,
  tracks:
    album.tracks !== void 0
      ? album.tracks.data.map((track) => ConvertTrack(track, album))
      : void 0,
  type: "album",
});

const ConvertPlaylist = (playlist: ApiPlaylist): Playlist => ({
  id: playlist.id.toString(),
  link: `https://www.deezer.com/playlist/${playlist.id}`,
  picture_big: playlist.picture_big,
  picture_small: playlist.picture_small,
  public: playlist.public,
  title: playlist.title,
  tracks:
    playlist.tracks !== void 0
      ? playlist.tracks.data.map((track) => ConvertTrack(track, track.album))
      : void 0,
  type: "playlist",
  user: {
    id: playlist.user.id.toString(),
    name: playlist.user.name,
    link: `https://www.deezer.com/profile/${playlist.user.id}`,
  },
});

const ConvertTrack = (
  track: ApiTrack,
  album: { id: number; title: string; cover_big: string; cover_small: string }
): Track => ({
  album: {
    id: album.id.toString(),
    link: `https://www.deezer.com/album/${album.id}`,
    title: album.title,
    cover_big: album.cover_big,
    cover_small: album.cover_small,
  },
  artist: {
    id: track.artist.id.toString(),
    name: track.artist.name,
    link: `https://www.deezer.com/artist/${track.artist.id}`,
    picture_big: track.artist.picture_big,
    picture_small: track.artist.picture_small,
  },
  duration: track.duration,
  id: track.id.toString(),
  link: `https://www.deezer.com/track/${track.id}`,
  preview: track.preview,
  readable: track.readable,
  title: track.title,
  type: "track",
});

// ------------------------------------------------------------------

export const DeezerApi = () => {
  const API_BASE = "https://api.deezer.com";

  const _asyncJsonp = <T>(url: string): Promise<T> =>
    new Promise((resolve, reject) => {
      jsonp(url, void 0, (err, data) => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve(data);
        }
      });
    });

  const _call = async <T>(path: string, qs?: string) => {
    // We have to rely on jsonp because the Deezer api is CORS restricted
    const fullpath = qs
      ? `${API_BASE}/${path}?${qs}&output=jsonp&callback=`
      : `${API_BASE}/${path}?output=jsonp&callback=`;
    return await _asyncJsonp<T>(fullpath);
  };

  const _search = <T>(type: string, query: string) =>
    _call<SearchResult<T>>(`search/${type}`, `q=${encodeURIComponent(query)}`);

  const _load = <T>(type: string, id: string) => _call<T>(`${type}/${id}`);

  const searchAlbums = (query: string) => _search<ApiAlbum>("album", query);

  const searchPlaylists = (query: string) =>
    _search<ApiPlaylist>("playlist", query);

  const searchTracks = (query: string) => _search<ApiTrack>("track", query);

  const searchAll = async (query: string): Promise<SearchAllResults> => {
    const [album, playlist, track] = await Promise.all([
      searchAlbums(query),
      searchPlaylists(query),
      searchTracks(query),
    ]);
    return {
      album: {
        data: album.data.map(ConvertAlbum),
        total: album.total,
      },
      playlist: {
        data: playlist.data.map(ConvertPlaylist),
        total: playlist.total,
      },
      track: {
        data: track.data.map((track) => ConvertTrack(track, track.album)),
        total: track.total,
      },
    };
  };

  const loadAlbum = async (id: string): Promise<Album> => {
    const album = await _load<ApiAlbum>("album", id);
    return ConvertAlbum(album);
  };

  const loadPlaylist = async (id: string): Promise<Playlist> => {
    const playlist = await _load<ApiPlaylist>("playlist", id);
    return ConvertPlaylist(playlist);
  };

  const loadTrack = async (id: string): Promise<Track> => {
    const track = await _load<ApiTrack>("track", id);
    return ConvertTrack(track, track.album);
  };

  return {
    searchAll,
    loadAlbum,
    loadPlaylist,
    loadTrack,
  };
};

// ------------------------------------------------------------------

export const DEFAULT_API = DeezerApi();
