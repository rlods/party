import React, {
  Component,
  Fragment,
  createRef,
  RefObject,
  ReactNode
} from "react";
import classNames from "classnames";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Room/SearchModal";
import IconButton, { CancelButton } from "../Common/IconButton";
import { DEFAULT_API, SearchAllResults } from "../../utils/api";
import { TrackMeta, PlaylistMeta, AlbumMeta } from "./Metas";
import "./SearchModal.scss";

// ------------------------------------------------------------------

const MAX_RESULTS_COUNT = 5;

function SearchResult<T extends { id: number }>({
  items,
  label,
  type,
  cb
}: {
  items: T[];
  label: string;
  type: string;
  cb: (item: T) => ReactNode;
}) {
  return items.length > 0 ? (
    <Fragment>
      <div className="SearchResult">
        <div className="SearchResultLabel">{label}</div>
        <div className="SearchResultItems">
          {items.slice(0, MAX_RESULTS_COUNT).map(item => (
            <div key={item.id} className={classNames("SearchResultItem", type)}>
              {cb(item)}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  ) : null;
}

// ------------------------------------------------------------------

type State = {
  query: string;
  results: SearchAllResults;
};

class SearchModal extends Component<MappedProps, State> {
  private queryRef: RefObject<HTMLInputElement> = createRef();

  public readonly state: State = {
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

  public render = () => (
    <FormModal
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
      onPreviewContainer,
      onPreviewTrack,
      onSelectContainer,
      onSelectTrack
    } = this.props;
    const { albums, playlists, tracks } = this.state.results;
    return (
      <Fragment>
        <SearchResult
          label={`Albums`}
          type="Album"
          items={albums.data}
          cb={album => {
            return (
              <Fragment>
                <IconButton
                  title="Add"
                  icon="plus"
                  onClick={() =>
                    onSelectContainer("album", album.id.toString())
                  }
                />
                <img
                  className="Cover"
                  src={album.cover_small}
                  alt="Cover"
                  onClick={() =>
                    onPreviewContainer("album", album.id.toString())
                  }
                />
                <AlbumMeta album={album} />
              </Fragment>
            );
          }}
        />
        <SearchResult
          label={`Playlists`}
          type="Playlist"
          items={playlists.data}
          cb={playlist => (
            <Fragment>
              <IconButton
                title="Add"
                icon="plus"
                onClick={() =>
                  onSelectContainer("playlist", playlist.id.toString())
                }
              />
              <img
                className="Cover"
                src={playlist.picture_small}
                alt="Cover"
                onClick={() =>
                  onPreviewContainer("playlist", playlist.id.toString())
                }
              />
              <PlaylistMeta playlist={playlist} />
            </Fragment>
          )}
        />
        <SearchResult
          label={`Tracks`}
          type="Track"
          items={tracks.data}
          cb={track => (
            <Fragment>
              <IconButton
                title="Add"
                icon="plus"
                onClick={() => onSelectTrack(track.id.toString())}
              />
              <img
                className="Cover"
                src={track.album.cover_small}
                alt="Cover"
                onClick={() => onPreviewTrack(track.id.toString())}
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
}

export default SearchModal;
