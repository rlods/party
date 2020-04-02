import React, {
  Component,
  Fragment,
  createRef,
  RefObject,
  ReactNode
} from "react";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Room/SearchModal";
import IconButton, { CancelButton } from "../Common/IconButton";
import { DEFAULT_API, SearchAllResults } from "../../utils/api";
import { TrackMeta, PlaylistMeta, AlbumMeta } from "./Metas";
import { MediaType } from "../../utils/containers";
import { Cover } from "./Cover";
import "./SearchModal.scss";

// ------------------------------------------------------------------

const MAX_RESULTS_COUNT = 5;

// ------------------------------------------------------------------

function SearchResultCategory<T extends { id: number }>({
  items,
  label,
  cb
}: {
  items: T[];
  label: string;
  type: MediaType;
  cb: (item: T) => ReactNode;
}) {
  return items.length > 0 ? (
    <Fragment>
      <div className="ModalField">
        <label>{label}</label>
      </div>
      {items.slice(0, MAX_RESULTS_COUNT).map(item => (
        <div key={item.id} className="ModalField">
          <div className="SearchResultItem">{cb(item)}</div>
        </div>
      ))}
    </Fragment>
  ) : null;
}

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
            <Fragment>
              <IconButton
                title="Add"
                icon="plus"
                onClick={() => this.onSelect("album", album.id)}
              />
              <Cover
                playing={mediaType === "album" && mediaId === album.id}
                image={album.cover_small}
                onPlay={() => this.onStartPreview("album", album.id)}
                onStop={() => this.onStopPreview()}
              />
              <AlbumMeta album={album} />
            </Fragment>
          )}
        />
        <SearchResultCategory
          label="Playlists"
          type="playlist"
          items={playlists.data}
          cb={playlist => (
            <Fragment>
              <IconButton
                title="Add"
                icon="plus"
                onClick={() => this.onSelect("playlist", playlist.id)}
              />
              <Cover
                playing={mediaType === "playlist" && mediaId === playlist.id}
                image={playlist.picture_small}
                onPlay={() => this.onStartPreview("playlist", playlist.id)}
                onStop={() => this.onStopPreview()}
              />
              <PlaylistMeta playlist={playlist} />
            </Fragment>
          )}
        />
        <SearchResultCategory
          label="Tracks"
          type="track"
          items={tracks.data}
          cb={track => (
            <Fragment>
              <IconButton
                title="Add"
                icon="plus"
                onClick={() => this.onSelect("track", track.id)}
              />
              <Cover
                playing={mediaType === "track" && mediaId === track.id}
                image={track.album.cover_small}
                onPlay={() => this.onStartPreview("track", track.id)}
                onStop={() => this.onStopPreview()}
              />
              <TrackMeta track={track} />
            </Fragment>
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
