import React, {
	FC,
	useRef,
	useState,
	useEffect,
	useCallback,
	useContext
} from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { FormModal } from "./FormModal";
import { IconButton } from "../components/Common/IconButton";
import { CancelButton } from "../components/Common/CancelButton";
import { searchMedias } from "../utils/providers";
import { Media } from "../components/Room/Medias";
import { SearchResults } from "../utils/providers";
import { SearchResultCategory } from "./SearchResultCategory";
import { isRoomLocked } from "../selectors/room";
import { RootState } from "../reducers";
import { ModalField } from "./ModalFields";
import { AppContext } from "../pages/AppContext";
import {
	MEDIA_TYPE_DEFINITIONS,
	MediaType,
	ProviderType
} from "../utils/medias";
import "./SearchModal.scss";
import { unifyArrayPreserveOrderPred } from "../utils";
import { CommonContext } from "../components/Common/CommonContext";

// ------------------------------------------------------------------

const SEARCH_RESULTS_COUNT = 5;
const VIEW_MORE_RESULTS_COUNT = 50;

// ------------------------------------------------------------------

export const SearchModal: FC = () => {
	const {
		onPreviewStart,
		onPreviewStop,
		onQueueAppend,
		onRoomLock
	} = useContext(AppContext);
	const { onModalClose } = useContext(CommonContext);
	const { t } = useTranslation();
	const queryRef = useRef<HTMLInputElement>(null);
	const locked = useSelector<RootState, boolean>(isRoomLocked);
	const [offset, setOffset] = useState(0);
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
		},
		spotify: {
			album: [],
			playlist: [],
			track: []
		}
	});

	const appendResults = useCallback(
		async (newResults: SearchResults) => {
			setResults({
				deezer: {
					album: unifyArrayPreserveOrderPred(
						[...results.deezer.album, ...newResults.deezer.album],
						(i1, i2) => i1.id === i2.id
					),
					playlist: unifyArrayPreserveOrderPred(
						[
							...results.deezer.playlist,
							...newResults.deezer.playlist
						],
						(i1, i2) => i1.id === i2.id
					),
					track: unifyArrayPreserveOrderPred(
						[...results.deezer.track, ...newResults.deezer.track],
						(i1, i2) => i1.id === i2.id
					)
				},
				spotify: {
					album: unifyArrayPreserveOrderPred(
						[...results.spotify.album, ...newResults.spotify.album],
						(i1, i2) => i1.id === i2.id
					),
					playlist: unifyArrayPreserveOrderPred(
						[
							...results.spotify.playlist,
							...newResults.spotify.playlist
						],
						(i1, i2) => i1.id === i2.id
					),
					track: unifyArrayPreserveOrderPred(
						[...results.spotify.track, ...newResults.spotify.track],
						(i1, i2) => i1.id === i2.id
					)
				}
			});
		},
		[results]
	);

	const onSearch = useCallback(async () => {
		if (query.trim().length > 0) {
			setResults(
				await searchMedias(query, {
					offset: 0,
					limit: SEARCH_RESULTS_COUNT
				})
			);
			setOffset(SEARCH_RESULTS_COUNT);
		}
	}, [query]);

	const onViewMore = useCallback(
		async (providerType: ProviderType, mediaType: MediaType) => {
			appendResults(
				await searchMedias(
					query,
					{
						offset,
						limit: VIEW_MORE_RESULTS_COUNT
					},
					providerType,
					mediaType
				)
			);
			setOffset(offset + VIEW_MORE_RESULTS_COUNT);
		},
		[offset, query, appendResults]
	);

	useEffect(() => {
		if (queryRef.current) {
			queryRef.current.focus();
		}
		return () => {
			onPreviewStop();
		};
	}, [onPreviewStop]);

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
					<CancelButton onClick={onModalClose} />
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
					key={`${provider}.${type}`}
					label={t(label)}
					items={results[provider][type]}
					onViewMore={() => onViewMore(provider, type)}
					cb={media => (
						<Media
							actions={
								<IconButton
									disabled={locked}
									title={t("medias.add")}
									icon="plus"
									onClick={() =>
										onQueueAppend(
											[
												{
													provider,
													type,
													id: media.id
												}
											],
											{
												onFailure: onRoomLock
											}
										)
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
							onPlay={() => {
								onPreviewStart({
									provider,
									type,
									id: media.id
								});
								setPlayingMediaId(media.id);
								setPlayingMediaProvider(provider);
								setPlayingMediaType(type);
							}}
							onStop={() => {
								onPreviewStop();
								setPlayingMediaId("");
								setPlayingMediaProvider("deezer");
								setPlayingMediaType("track");
							}}
						/>
					)}
				/>
			))}
		</FormModal>
	);
};
