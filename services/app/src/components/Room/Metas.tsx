import React from "react";
//
import { ApiAlbum, ApiPlaylist, ApiTrack } from "../../utils/api";
import "./Metas.scss";

// ------------------------------------------------------------------

export const AlbumMeta = ({ album }: { album: ApiAlbum }) => (
  <div className="Metas">
    <div className="Meta AlbumTitle">
      <a href={album.link} target="_blank" rel="noopener noreferrer">
        {album.title}
      </a>
    </div>
    <div className="Meta AlbumArtistName">
      by{" "}
      <a href={album.artist.link} target="_blank" rel="noopener noreferrer">
        {album.artist.name}
      </a>
    </div>
  </div>
);

export const PlaylistMeta = ({ playlist }: { playlist: ApiPlaylist }) => (
  <div className="Metas">
    <div className="Meta PlaylistTitle">
      <a href={playlist.link} target="_blank" rel="noopener noreferrer">
        {playlist.title}
      </a>
    </div>
  </div>
);

export const TrackMeta = ({ track }: { track: ApiTrack }) => (
  <div className="Metas">
    <div className="Meta TrackTitle">
      <a href={track.link} target="_blank" rel="noopener noreferrer">
        {track.title}
      </a>
    </div>
    <div className="Meta TrackArtistName">
      by{" "}
      <a href={track.artist.link} target="_blank" rel="noopener noreferrer">
        {track.artist.name}
      </a>
    </div>
  </div>
);
