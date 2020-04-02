import React, { Fragment, ReactNode } from "react";
//
import { MediaType } from "../../utils/containers";

// ------------------------------------------------------------------

const MAX_RESULTS_COUNT = 5;

// ------------------------------------------------------------------

const SearchResultCategory = <T extends { id: number }>({
  items,
  label,
  cb
}: {
  items: T[];
  label: string;
  type: MediaType;
  cb: (item: T) => ReactNode;
}) =>
  items.length > 0 ? (
    <Fragment>
      <div className="ModalField">
        <label>{label}</label>
      </div>
      {items.slice(0, MAX_RESULTS_COUNT).map(item => (
        <div key={item.id} className="ModalField">
          <div className="SearchResultItem">{cb(item)}</div>
        </div>
      ))}
    </Fragment>
  ) : null;

export default SearchResultCategory;
