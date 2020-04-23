import React, { FC, useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "../Modals/FormModal";
import { IconButton } from "../Common/IconButton";
import { CancelButton } from "../Common/CancelButton";
import { searchMedias } from "../../utils/providers";
import { Media } from "./Medias";
import {
	MEDIA_TYPE_DEFINITIONS,
	MediaType,
	ProviderType
} from "../../utils/medias";
import { SearchResults } from "../../utils/providers";
import { SearchResultCategory } from "./SearchResultCategory";
import { Dispatch } from "../../actions";
import { popModal } from "../../reducers/modals";
import { previewMedia } from "../../actions/medias";
import { isRoomLocked } from "../../selectors/room";
import { RootState } from "../../reducers";
import { ModalField } from "../Modals/ModalFields";
import { PREVIEW_PLAYER } from "../../utils/player";
import { appendToQueue } from "../../actions/queue";
import "./SearchModal.scss";

// ------------------------------------------------------------------

const SEARCH_RESULTS_COUNT = 5;
const VIEW_MORE_RESULTS_COUNT = 50;

// ------------------------------------------------------------------

export const SearchModal: FC = () => {
	const dispatch = useDispatch<Dispatch>();
	const { t } = useTranslation();
	const queryRef = useRef<HTMLInputElement>(null);
	const locked = useSelector<RootState, boolean>(isRoomLocked);
	const [playingMediaId, setPlayingMediaId] = useState("");
	const [playingMediaProvider, setPlayingMediaProvider] = useState<
		ProviderType
	>("deezer");
	const [playingMediaType, setPlayingMediaType] = useState<MediaType>(
		"track"
	);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResults>({
		deezer: {
			album: [],
			playlist: [],
			track: []
		}
	});

	const onClose = useCallback(() => dispatch(popModal()), [dispatch]);

	const onSearch = useCallback(async () => {
		if (query.trim().length > 0) {
			setResults(
				await searchMedias(query, {
					limit: SEARCH_RESULTS_COUNT
				})
			);
		}
	}, [query]);

	const onSelect = useCallback(
		(provider: ProviderType, type: MediaType, id: string) =>
			dispatch(appendToQueue([{ provider, type, id }])),
		[dispatch]
	);

	const onStartPreview = useCallback(
		(provider: ProviderType, type: MediaType, id: string) => {
			dispatch(previewMedia({ provider, type, id }));
			setPlayingMediaId(id);
			setPlayingMediaProvider(provider);
			setPlayingMediaType(type);
		},
		[dispatch]
	);

	const onStopPreview = useCallback(async () => {
		console.debug("Stop previewing...");
		await PREVIEW_PLAYER.stop();
		setPlayingMediaId("");
		setPlayingMediaProvider("deezer");
		setPlayingMediaType("track");
	}, []);

	const onViewMore = useCallback(
		async (type: MediaType) => {
			setResults(
				await searchMedias(
					query,
					{
						limit: VIEW_MORE_RESULTS_COUNT
					},
					type
				)
			);
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
			{MEDIA_TYPE_DEFINITIONS.map(({ label, provider, type }) => (
				<SearchResultCategory
					key={type}
					label={t(label)}
					items={results[provider][type]}
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
							playable={true}
							playing={
								playingMediaProvider === provider &&
								playingMediaType === type &&
								playingMediaId === media.id
							}
							onPlay={() =>
								onStartPreview(provider, type, media.id)
							}
							onStop={onStopPreview}
						/>
					)}
				/>
			))}
		</FormModal>
	);
};
