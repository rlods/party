import React from "react";
//
import { ApiAlbum, ApiPlaylist, ApiTrack } from "../../utils/api";

// ------------------------------------------------------------------

export const AlbumMeta = ({ album }: { album: ApiAlbum }) => (
  <div className="Meta">
    <div className="AlbumTitle">
      <a href={album.link} target="_blank" rel="noopener noreferrer">
        {album.title}
      </a>
    </div>
    <div className="AlbumArtistName">
      by{" "}
      <a href={album.artist.link} target="_blank" rel="noopener noreferrer">
        {album.artist.name}
      </a>
    </div>
  </div>
);

export const PlaylistMeta = ({ playlist }: { playlist: ApiPlaylist }) => (
  <div className="Meta">
    <div className="PlaylistTitle">
      <a href={playlist.link} target="_blank" rel="noopener noreferrer">
        {playlist.title}
      </a>
    </div>
  </div>
);

export const TrackMeta = ({ track }: { track: ApiTrack }) => (
  <div className="Meta">
    <div className="TrackTitle">
      <a href={track.link} target="_blank" rel="noopener noreferrer">
        {track.title}
      </a>
    </div>
    <div className="TrackArtistName">
      by{" "}
      <a href={track.artist.link} target="_blank" rel="noopener noreferrer">
        {track.artist.name}
      </a>
    </div>
  </div>
);
