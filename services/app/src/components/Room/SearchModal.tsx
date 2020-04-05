import React, { Component, createRef, RefObject } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Room/SearchModal";
import IconButton, { CancelButton } from "../Common/IconButton";
import { DEFAULT_API, SearchAllResults } from "../../utils/deezer";
import Media from "./Medias";
import { MediaType } from "../../utils/medias";
import SearchResultCategory from "./SearchResultCategory";
import "./SearchModal.scss";

// ------------------------------------------------------------------

const RESULT_DESCRIPTIONS: Array<{
  label: string;
  type: MediaType;
}> = [
  {
    label: "medias.albums",
    type: "album",
  },
  {
    label: "medias.playlists",
    type: "playlist",
  },
  {
    label: "medias.tracks",
    type: "track",
  },
];

// ------------------------------------------------------------------

type State = {
  playingMediaId: number;
  playingMediaType: MediaType;
  query: string;
  results: SearchAllResults;
};

class SearchModal extends Component<MappedProps & WithTranslation, State> {
  private queryRef: RefObject<HTMLInputElement> = createRef();

  public readonly state: State = {
    playingMediaId: 0,
    playingMediaType: "track",
    query: "",
    results: {
      album: { data: [], total: 0 },
      playlist: { data: [], total: 0 },
      track: { data: [], total: 0 },
    },
  };

  public componentDidMount() {
    if (this.queryRef.current) {
      this.queryRef.current.focus();
    }
  }

  public componentWillUnmount() {
    this.props.onStopPreview();
  }

  public render = () => {
    const { t } = this.props;
    return (
      <FormModal
        className="SearchModal"
        title={t("medias.medias_search")}
        onSubmit={this.onSearch}
        renderButtons={this.renderButtons}
      >
        {this.renderInputs()}
        {this.renderResults()}
      </FormModal>
    );
  };

  private renderButtons = () => {
    const { t } = this.props;
    return (
      <>
        <IconButton
          title={t("medias.search")}
          kind="primary"
          icon="search"
          type="submit"
        />
        <CancelButton onClick={this.props.onClose} />
      </>
    );
  };

  private renderInputs = () => {
    const { t } = this.props;
    const { query } = this.state;
    return (
      <div className="ModalField">
        <input
          id="modal-query"
          type="text"
          placeholder={t("medias.search_placeholder")}
          maxLength={100}
          minLength={2}
          required={true}
          value={query}
          ref={this.queryRef}
          onChange={(e) => {
            this.setState({ query: e.target.value });
          }}
        />
      </div>
    );
  };

  private renderResults = () => {
    const { locked, t } = this.props;
    const { playingMediaId, playingMediaType, results } = this.state;
    return RESULT_DESCRIPTIONS.map(({ label, type }) => (
      <SearchResultCategory
        key={type}
        label={t(label)}
        items={results[type].data}
        cb={(media) => (
          <Media
            actions={
              !locked ? (
                <IconButton
                  title={t("medias.add")}
                  icon="plus"
                  onClick={() => this.onSelect(type, media.id)}
                />
              ) : null
            }
            media={media}
            mediaType={type}
            playable={true}
            playing={playingMediaType === type && playingMediaId === media.id}
            onPlay={() => this.onStartPreview(type, media.id)}
            onStop={this.onStopPreview}
          />
        )}
      />
    ));
  };

  private onSearch = async () => {
    const { query } = this.state;
    if (query.trim().length > 0) {
      this.setState({ results: await DEFAULT_API.searchAll(query) });
    }
  };

  private onSelect = (mediaType: MediaType, mediaId: number) =>
    this.props.onSelect(mediaType, mediaId.toString());

  private onStartPreview = (
    playingMediaType: MediaType,
    playingMediaId: number
  ) => {
    this.props.onStartPreview(playingMediaType, playingMediaId.toString());
    this.setState({
      playingMediaId,
      playingMediaType,
    });
  };

  private onStopPreview = () => {
    this.props.onStopPreview();
    this.setState({
      playingMediaId: 0,
      playingMediaType: "track",
    });
  };
}

export default withTranslation()(SearchModal);
