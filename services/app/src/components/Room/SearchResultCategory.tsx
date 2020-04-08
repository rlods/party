import React, { ReactNode } from "react";
//
import { Media } from "../../utils/medias";
import { ModalField } from "../Modals/ModalFields";

// ------------------------------------------------------------------

const MAX_RESULTS_COUNT = 5;

// ------------------------------------------------------------------

export const SearchResultCategory = ({
	items,
	label,
	cb
}: {
	items: Media[];
	label: string;
	cb: (item: Media) => ReactNode;
}) =>
	items.length > 0 ? (
		<>
			<ModalField>
				<div className="XXX">
					<label>{label}</label>
				</div>
			</ModalField>
			{items.slice(0, MAX_RESULTS_COUNT).map(item => (
				<ModalField key={item.id}>
					<div className="SearchResultItem">{cb(item)}</div>
				</ModalField>
			))}
		</>
	) : null;
