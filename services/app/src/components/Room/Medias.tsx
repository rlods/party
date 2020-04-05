import React, { ReactNode, Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import { ApiAlbum, ApiPlaylist, ApiTrack } from "../../utils/deezer";
import Cover from "./Cover";
import "./Medias.scss";
import { LoadingIcon } from "../Common/Icon";

// ------------------------------------------------------------------

type AlbumProps = {
  actions?: ReactNode;
  album: ApiAlbum;
  playable: boolean;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
};

export class _Album extends Component<AlbumProps & WithTranslation> {
  public render = () => {
    const { actions, album, playable, playing, onPlay, onStop, t } = this.props;
    return (
      <div className="Media Album">
        {actions}
        <Cover
          playable={playable}
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
            <a
              href={album.artist.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("medias.by", { artist: album.artist.name })}
            </a>
          </div>
        </div>
      </div>
    );
  };
}

export const Album = withTranslation()(_Album);

// ------------------------------------------------------------------

type PlaylistProps = {
  actions?: ReactNode;
  playlist: ApiPlaylist;
  playable: boolean;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
};

export class _Playlist extends Component<PlaylistProps & WithTranslation> {
  public render = () => {
    const { actions, playlist, playable, playing, onPlay, onStop } = this.props;
    return (
      <div className="Media Playlist">
        {actions}
        <Cover
          playable={playable}
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
  };
}

export const Playlist = withTranslation()(_Playlist);

// ------------------------------------------------------------------

type TrackProps = {
  actions?: ReactNode;
  track: ApiTrack | null; // if null : stiil loading or cannot be loaded or to reload later because of rate limit
  playable: boolean;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
};

export class _Track extends Component<TrackProps & WithTranslation> {
  public render = () => {
    const { actions, track, playable, playing, onPlay, onStop, t } = this.props;
    return (
      <div className="Media Track">
        {actions}
        <Cover
          playable={playable}
          playing={playing}
          image={track?.album.cover_small || ""}
          onPlay={onPlay}
          onStop={onStop}
        />
        <div className="Metas">
          {!!track ? (
            <>
              <div className="Meta TrackTitle">
                <a href={track.link} target="_blank" rel="noopener noreferrer">
                  {track.title}
                </a>
              </div>
              <div className="Meta TrackArtistName">
                <a
                  href={track.artist.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("medias.by", { artist: track.artist.name })}
                </a>
              </div>
            </>
          ) : (
            <LoadingIcon size="M" />
          )}
        </div>
      </div>
    );
  };
}

export const Track = withTranslation()(_Track);
