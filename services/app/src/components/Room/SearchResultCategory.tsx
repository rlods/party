import React, { ReactNode } from "react";
//
import { Media } from "../../utils/medias";
import { ModalField } from "../Modals/ModalFields";
import { IconButton } from "../Common/IconButton";

// ------------------------------------------------------------------

export const SearchResultCategory = ({
	items,
	label,
	onViewMore,
	cb
}: {
	items: Media[];
	label: string;
	onViewMore: () => void;
	cb: (item: Media) => ReactNode;
}) =>
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
