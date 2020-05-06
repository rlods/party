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
import { AppContext } from "../pages/App";
import {
	MEDIA_TYPE_DEFINITIONS,
	MediaType,
	ProviderType
} from "../utils/medias";
import "./SearchModal.scss";

// ------------------------------------------------------------------

const SEARCH_RESULTS_COUNT = 5;
const VIEW_MORE_RESULTS_COUNT = 50;

// ------------------------------------------------------------------

export const SearchModal: FC = () => {
	const {
		onQueueAppend,
		onModalClose,
		onPreviewStart,
		onPreviewStop
	} = useContext(AppContext);
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
		},
		spotify: {
			album: [],
			playlist: [],
			track: []
		}
	});

	const onSearch = useCallback(async () => {
		if (query.trim().length > 0) {
			setResults(
				await searchMedias(query, {
					limit: SEARCH_RESULTS_COUNT
				})
			);
		}
	}, [query]);

	const onViewMore = useCallback(
		async (providerType: ProviderType, mediaType: MediaType) => {
			setResults(
				await searchMedias(
					query,
					{
						limit: VIEW_MORE_RESULTS_COUNT
					},
					providerType,
					mediaType
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
										onQueueAppend(true, {
											provider,
											type,
											id: media.id
										})
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
