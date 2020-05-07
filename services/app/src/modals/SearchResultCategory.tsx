import React, { FC, ReactNode } from "react";
//
import { Media } from "../utils/medias";
import { ModalField } from "./ModalFields";
import { IconButton } from "../components/Common/IconButton";

// ------------------------------------------------------------------

export const SearchResultCategory: FC<{
	items: ReadonlyArray<Media>;
	label: string;
	onViewMore: () => void;
	cb: (item: Media) => ReactNode;
}> = ({ items, label, onViewMore, cb }) =>
	items.length > 0 ? (
		<>
			<ModalField>
				<div className="XXX">
					<label>{label}</label>
				</div>
			</ModalField>
			{items.map(item => (
				<ModalField key={item.id}>
					<div className="SearchResultItem">{cb(item)}</div>
				</ModalField>
			))}
			<ModalField>
				<div className="XXX">
					<IconButton
						icon="ellipsis-h"
						onClick={onViewMore}
						title="View more..."
					/>
				</div>
			</ModalField>
		</>
	) : null;
