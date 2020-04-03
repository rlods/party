import React, { Component, Fragment, createRef, RefObject } from "react";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Room/SearchModal";
import IconButton, { CancelButton } from "../Common/IconButton";
import { DEFAULT_API, SearchAllResults } from "../../utils/api";
import { Album, Playlist, Track } from "./Medias";
import { MediaType } from "../../utils/containers";
import SearchResultCategory from "./SearchResultCategory";
import "./SearchModal.scss";

// ------------------------------------------------------------------

type State = {
  mediaId: number;
  mediaType: MediaType;
  query: string;
  results: SearchAllResults;
};

class SearchModal extends Component<MappedProps, State> {
  private queryRef: RefObject<HTMLInputElement> = createRef();

  public readonly state: State = {
    mediaId: 0,
    mediaType: "track",
    query: "",
    results: {
      albums: { data: [], total: 0 },
      playlists: { data: [], total: 0 },
      tracks: { data: [], total: 0 }
    }
  };

  public componentDidMount() {
    if (this.queryRef.current) {
      this.queryRef.current.focus();
    }
  }

  public componentWillUnmount() {
    this.props.onStopPreview();
  }

  public render = () => (
    <FormModal
      className="SearchModal"
      title="Search"
      onSubmit={this.onSearch}
      renderButtons={this.renderButtons}
    >
      {this.renderInputs()}
      {this.renderResults()}
    </FormModal>
  );

  private renderButtons = () => (
    <Fragment>
      <IconButton title="Search" kind="primary" icon="search" type="submit" />
      <CancelButton onClick={this.props.onClose} />
    </Fragment>
  );

  private renderInputs = () => {
    const { query } = this.state;
    return (
      <div className="ModalField">
        <label htmlFor="modal-query">Query</label>
        <input
          id="modal-query"
          type="text"
          placeholder="Query..."
          maxLength={100}
          minLength={2}
          required={true}
          value={query}
          ref={this.queryRef}
          onChange={e => {
            this.setState({ query: e.target.value });
          }}
        />
      </div>
    );
  };

  private renderResults = () => {
    const { locked } = this.props;
    const {
      mediaId,
      mediaType,
      results: { albums, playlists, tracks }
    } = this.state;
    return (
      <Fragment>
        <SearchResultCategory
          label="Albums"
          type="album"
          items={albums.data}
          cb={album => (
            <Album
              actions={
                !locked ? (
                  <IconButton
                    title="Add"
                    icon="plus"
                    onClick={() => this.onSelect("album", album.id)}
                  />
                ) : null
              }
              album={album}
              playing={mediaType === "album" && mediaId === album.id}
              onPlay={() => this.onStartPreview("album", album.id)}
              onStop={() => this.onStopPreview()}
            />
          )}
        />
        <SearchResultCategory
          label="Playlists"
          type="playlist"
          items={playlists.data}
          cb={playlist => (
            <Playlist
              actions={
                !locked ? (
                  <IconButton
                    title="Add"
                    icon="plus"
                    onClick={() => this.onSelect("playlist", playlist.id)}
                  />
                ) : null
              }
              playlist={playlist}
              playing={mediaType === "playlist" && mediaId === playlist.id}
              onPlay={() => this.onStartPreview("playlist", playlist.id)}
              onStop={() => this.onStopPreview()}
            />
          )}
        />
        <SearchResultCategory
          label="Tracks"
          type="track"
          items={tracks.data}
          cb={track => (
            <Track
              actions={
                !locked ? (
                  <IconButton
                    title="Add"
                    icon="plus"
                    onClick={() => this.onSelect("track", track.id)}
                  />
                ) : null
              }
              track={track}
              playing={mediaType === "track" && mediaId === track.id}
              onPlay={() => this.onStartPreview("track", track.id)}
              onStop={() => this.onStopPreview()}
            />
          )}
        />
      </Fragment>
    );
  };

  private onSearch = async () => {
    const { query } = this.state;
    if (query.trim().length > 0) {
      this.setState({ results: await DEFAULT_API.searchAll(query) });
    }
  };

  private onSelect = (mediaType: MediaType, mediaId: number) =>
    this.props.onSelect(mediaType, mediaId.toString());

  private onStartPreview = (mediaType: MediaType, mediaId: number) => {
    this.props.onStartPreview(mediaType, mediaId.toString());
    this.setState({
      mediaId,
      mediaType
    });
  };

  private onStopPreview = () => {
    this.props.onStopPreview();
    this.setState({
      mediaId: 0,
      mediaType: "track"
    });
  };
}

export default SearchModal;
