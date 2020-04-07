import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "../Modals/FormModal";
import { IconButton } from "../Common/IconButton";
import { CancelButton } from "../Common/CancelButton";
import { DEFAULT_API } from "../../utils/deezer";
import { Media } from "./Medias";
import {
	MEDIA_TYPE_DEFINITIONS,
	MediaType,
	ProviderType,
	SearchResults
} from "../../utils/medias";
import { SearchResultCategory } from "./SearchResultCategory";
import { Dispatch } from "../../actions";
import { popModal } from "../../actions/modals";
import { loadMedias } from "../../actions/medias";
import { stopPreview } from "../../actions/player";
import { isRoomLocked } from "../../selectors/room";
import { RootState } from "../../reducers";
import "./SearchModal.scss";

// ------------------------------------------------------------------

export const SearchModal = () => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const queryRef = useRef<HTMLInputElement>(null);
	const locked = useSelector<RootState, boolean>(isRoomLocked);
	const [playingMediaId, setPlayingMediaId] = useState("");
	const [playingMediaType, setPlayingMediaType] = useState<MediaType>(
		"track"
	);
	const [provider] = useState<ProviderType>("deezer");
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResults>({
		// keys are MediaType
		album: [],
		playlist: [],
		track: []
	});

	const onClose = useCallback(() => dispatch(popModal()), [dispatch]);

	const onSearch = useCallback(async () => {
		if (query.trim().length > 0) {
			setResults(await DEFAULT_API.search(query));
		}
	}, [query]);

	const onSelect = useCallback(
		(provider: ProviderType, mediaType: MediaType, mediaId: string) =>
			dispatch(loadMedias(provider, mediaType, [mediaId], true, false)),
		[dispatch]
	);

	const onStartPreview = useCallback(
		(mediaType: MediaType, mediaId: string) => {
			dispatch(loadMedias(provider, mediaType, [mediaId], false, true));
			setPlayingMediaId(mediaId);
			setPlayingMediaType(mediaType);
		},
		[dispatch, provider]
	);

	const onStopPreview = useCallback(() => {
		dispatch(stopPreview());
		setPlayingMediaId("");
		setPlayingMediaType("track");
	}, [dispatch]);

	useEffect(() => {
		if (queryRef.current) {
			queryRef.current.focus();
		}
		return () => {
			dispatch(stopPreview());
		};
	}, [dispatch]);

	return (
		<FormModal
			className="SearchModal"
			title={t("medias.medias_search")}
			onSubmit={onSearch}
			renderButtons={() => (
				<>
					<IconButton
						title={t("medias.search")}
						kind="primary"
						icon="search"
						type="submit"
					/>
					<CancelButton onClick={onClose} />
				</>
			)}>
			<div className="ModalField">
				<input
					id="modal-query"
					type="text"
					placeholder={t("medias.search_placeholder")}
					maxLength={100}
					minLength={2}
					required={true}
					value={query}
					ref={queryRef}
					onChange={e => setQuery(e.target.value)}
				/>
			</div>
			{MEDIA_TYPE_DEFINITIONS.map(({ label, type }) => (
				<SearchResultCategory
					key={type}
					label={t(label)}
					items={results[type]}
					cb={media => (
						<Media
							actions={
								!locked ? (
									<IconButton
										title={t("medias.add")}
										icon="plus"
										onClick={() =>
											onSelect(provider, type, media.id)
										}
									/>
								) : null
							}
							media={media}
							mediaType={type}
							playable={true}
							playing={
								playingMediaType === type &&
								playingMediaId === media.id
							}
							onPlay={() => onStartPreview(type, media.id)}
							onStop={onStopPreview}
						/>
					)}
				/>
			))}
		</FormModal>
	);
};
