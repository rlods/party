import React, { ReactNode } from "react";
//
import { ApiAlbum, ApiPlaylist, ApiTrack } from "../../utils/api";
import { Cover } from "./Cover";
import "./Medias.scss";

// ------------------------------------------------------------------

export const Album = ({
  actions,
  album,
  playing,
  onPlay,
  onStop
}: {
  actions?: ReactNode;
  album: ApiAlbum;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
}) => (
  <div className="Media Album">
    {actions}
    <Cover
      playing={playing}
      image={album.cover_small}
      onPlay={onPlay}
      onStop={onStop}
    />
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
  </div>
);

// ------------------------------------------------------------------

export const Playlist = ({
  actions,
  playlist,
  playing,
  onPlay,
  onStop
}: {
  actions?: ReactNode;
  playlist: ApiPlaylist;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
}) => (
  <div className="Media Playlist">
    {actions}
    <Cover
      playing={playing}
      image={playlist.picture_small}
      onPlay={onPlay}
      onStop={onStop}
    />
    <div className="Metas">
      <div className="Meta PlaylistTitle">
        <a href={playlist.link} target="_blank" rel="noopener noreferrer">
          {playlist.title}
        </a>
      </div>
    </div>
  </div>
);

// ------------------------------------------------------------------

export const Track = ({
  actions,
  track,
  playing,
  onPlay,
  onStop
}: {
  actions?: ReactNode;
  track: ApiTrack;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
}) => (
  <div className="Media Track">
    {actions}
    <Cover
      playing={playing}
      image={track.album.cover_small}
      onPlay={onPlay}
      onStop={onStop}
    />
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
  </div>
);
