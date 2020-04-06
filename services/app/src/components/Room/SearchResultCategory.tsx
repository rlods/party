import React, { ReactNode } from "react";
//
import { Media } from "../../utils/medias";

// ------------------------------------------------------------------

const MAX_RESULTS_COUNT = 5;

// ------------------------------------------------------------------

const SearchResultCategory = ({
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
			<div className="ModalField">
				<label>{label}</label>
			</div>
			{items.slice(0, MAX_RESULTS_COUNT).map(item => (
				<div key={item.id} className="ModalField">
					<div className="SearchResultItem">{cb(item)}</div>
				</div>
			))}
		</>
	) : null;

export default SearchResultCategory;
