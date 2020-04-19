import React from "react";
import { GRID_CELL_UNIT_SIZE } from "../../utils/games/seabattle";

// ------------------------------------------------------------------

const SEA_COLOR1 = "#a6dbf8";
const SEA_COLOR2 = "#50a3db";

// ------------------------------------------------------------------

export const BattleAssets = () => (
	<defs>
		<circle id="missed1" cx="10" cy="10" r="8" fill="#fff" />
		<circle id="missed2" cx="10" cy="10" r="8" fill="#fff7" />
		<circle id="hitted1" cx="10" cy="10" r="8" fill="#ffcf02" />
		<circle id="hitted2" cx="10" cy="10" r="8" fill="#e52524" />
		<path id="cell" d="M0,0V40H40V0ZM36,36H4V4H36Z" />
		<use id="cell-selected" href="#cell" fill="#FF0" />
		<use id="cell-selection" href="#cell" fill="#555" />
		<path
			id="bullet1"
			d="M16,4C16,8.46,0,8,0,8V0S16-.46,16,4Z"
			fill="#afafaf"
		/>
		<path
			id="bullet2"
			d="M16,4C16,8.46,0,8,0,8V0S16-.46,16,4Z"
			fill="#676766"
		/>
		<path
			id="bullet3"
			d="M16,4C16,8.46,0,8,0,8V0S16-.46,16,4Z"
			fill="#000000"
		/>
		<path
			id="mine"
			d="M16,9V7H13.77a5.92,5.92,0,0,0-1-2.41L14.35,3,13,1.65,11.39,3.23A5.92,5.92,0,0,0,9,2.23V0H7V2.23a5.92,5.92,0,0,0-2.41,1L3,1.65,1.65,3,3.23,4.61A5.92,5.92,0,0,0,2.23,7H0V9H2.23a5.92,5.92,0,0,0,1,2.41L1.65,13,3,14.35l1.58-1.58a5.92,5.92,0,0,0,2.41,1V16H9V13.77a5.92,5.92,0,0,0,2.41-1L13,14.35,14.35,13l-1.58-1.58a5.92,5.92,0,0,0,1-2.41Z"
			fill="#000000"
		/>
		<path id="boat1" d="M28,14C28,19,14,28,14,28H0V0H14S28,9.05,28,14Z" />
		<use id="boat1-E" href="#boat1" />
		<use id="boat1-N" href="#boat1" transform="rotate(-90, 14, 14)" />
		<use id="boat1-S" href="#boat1" transform="rotate(90, 14, 14)" />
		<use id="boat1-W" href="#boat1" transform="rotate(180, 14, 14)" />
		<path
			id="boat2"
			d="M68,14C68,19,51.89,28,51.89,28H0V0H51.89S68,9.05,68,14Z"
		/>
		<use id="boat2-E" href="#boat2" />
		<use id="boat2-N" href="#boat2" transform="rotate(-90, 14, 14)" />
		<use id="boat2-S" href="#boat2" transform="rotate(90, 14, 14)" />
		<use id="boat2-W" href="#boat2" transform="rotate(180, 14, 14)" />
		<path
			id="boat3"
			d="M108,14C108,19,91.24,28,91.24,28H0V0H91.24S108,9.05,108,14Z"
		/>
		<use id="boat3-E" href="#boat3" />
		<use id="boat3-N" href="#boat3" transform="rotate(-90, 14, 14)" />
		<use id="boat3-S" href="#boat3" transform="rotate(90, 14, 14)" />
		<use id="boat3-W" href="#boat3" transform="rotate(180, 14, 14)" />
		<pattern
			id="sea-grid"
			width="80"
			height="80"
			patternUnits="userSpaceOnUse">
			<g>
				<rect
					width={GRID_CELL_UNIT_SIZE}
					height={GRID_CELL_UNIT_SIZE}
					fill={SEA_COLOR1}
					x="0"
					y="0"
				/>
				<rect
					width={GRID_CELL_UNIT_SIZE}
					height={GRID_CELL_UNIT_SIZE}
					fill={SEA_COLOR2}
					x={GRID_CELL_UNIT_SIZE}
					y="0"
				/>
				<rect
					width={GRID_CELL_UNIT_SIZE}
					height={GRID_CELL_UNIT_SIZE}
					fill={SEA_COLOR2}
					x="0"
					y={GRID_CELL_UNIT_SIZE}
				/>
				<rect
					width={GRID_CELL_UNIT_SIZE}
					height={GRID_CELL_UNIT_SIZE}
					fill={SEA_COLOR1}
					x={GRID_CELL_UNIT_SIZE}
					y={GRID_CELL_UNIT_SIZE}
				/>
			</g>
		</pattern>
	</defs>
);
