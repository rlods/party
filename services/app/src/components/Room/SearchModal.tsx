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
import { isRoomLocked } from "../../selectors/room";
import { RootState } from "../../reducers";
import { ModalField } from "../Modals/ModalFields";
import { PREVIEW_PLAYER } from "../../utils/player";
import "./SearchModal.scss";

// ------------------------------------------------------------------

const SEARCH_RESULTS_COUNT = 5;
const VIEW_MORE_RESULTS_COUNT = 50;

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
			setResults(
				await DEFAULT_API.search(query, {
					limit: SEARCH_RESULTS_COUNT
				})
			);
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

	const onStopPreview = useCallback(async () => {
		console.debug("Stop previewing...");
		await PREVIEW_PLAYER.stop();
		setPlayingMediaId("");
		setPlayingMediaType("track");
	}, []);

	const onViewMore = useCallback(
		async (type: MediaType) => {
			const results: SearchResults = {
				album: [],
				playlist: [],
				track: []
			};
			switch (type) {
				case "album":
					results["album"] = await DEFAULT_API.searchAlbums(query, {
						limit: VIEW_MORE_RESULTS_COUNT
					});
					break;
				case "playlist":
					results["playlist"] = await DEFAULT_API.searchPlaylists(
						query,
						{
							limit: VIEW_MORE_RESULTS_COUNT
						}
					);
					break;
				case "track":
					results["track"] = await DEFAULT_API.searchTracks(query, {
						limit: VIEW_MORE_RESULTS_COUNT
					});
					break;
			}
			setResults(results);
		},
		[query, setResults]
	);

	useEffect(() => {
		if (queryRef.current) {
			queryRef.current.focus();
		}
		return () => {
			console.debug("Stop previewing...");
			/*await*/ PREVIEW_PLAYER.stop();
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
						disabled={query.trim().length === 0}
						title={t("medias.search")}
						kind="primary"
						icon="search"
						type="submit"
					/>
					<CancelButton onClick={onClose} />
				</>
			)}>
			<ModalField>
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
			</ModalField>
			{MEDIA_TYPE_DEFINITIONS.map(({ label, type }) => (
				<SearchResultCategory
					key={type}
					label={t(label)}
					items={results[type]}
					onViewMore={() => onViewMore(type)}
					cb={media => (
						<Media
							actions={
								<IconButton
									disabled={locked}
									title={t("medias.add")}
									icon="plus"
									onClick={() =>
										onSelect(provider, type, media.id)
									}
								/>
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
