import React, { Component, createRef, RefObject } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
//
import FormModal from "../Modals/FormModal";
import { MappedProps } from "../../containers/Room/SearchModal";
import IconButton, { CancelButton } from "../Common/IconButton";
import { DEFAULT_API } from "../../utils/deezer";
import Media from "./Medias";
import {
  MEDIA_TYPE_DEFINITIONS,
  MediaType,
  ProviderType,
  SearchAllResults,
} from "../../utils/medias";
import SearchResultCategory from "./SearchResultCategory";
import "./SearchModal.scss";

// ------------------------------------------------------------------

type State = {
  playingMediaId: string;
  playingMediaType: MediaType;
  provider: ProviderType;
  query: string;
  results: SearchAllResults;
};

class SearchModal extends Component<MappedProps & WithTranslation, State> {
  private queryRef: RefObject<HTMLInputElement> = createRef();

  public readonly state: State = {
    playingMediaId: "",
    playingMediaType: "track",
    provider: "deezer",
    query: "",
    results: {
      // keys are MediaType
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
    this.props.onStop();
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
    const { onSelect, locked, t } = this.props;
    const { playingMediaId, playingMediaType, provider, results } = this.state;
    return MEDIA_TYPE_DEFINITIONS.map(({ label, type }) => (
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
                  onClick={() => onSelect(provider, type, media.id)}
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

  private onStartPreview = (
    playingMediaType: MediaType,
    playingMediaId: string
  ) => {
    this.props.onPlay(this.state.provider, playingMediaType, playingMediaId);
    this.setState({
      playingMediaId,
      playingMediaType,
    });
  };

  private onStopPreview = () => {
    this.props.onStop();
    this.setState({
      playingMediaId: "",
      playingMediaType: "track",
    });
  };
}

export default withTranslation()(SearchModal);
