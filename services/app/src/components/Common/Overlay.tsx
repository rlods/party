import React, {
	FC,
	MouseEvent,
	useEffect,
	useContext,
	useRef,
	ReactNode
} from "react";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
//
import { RootState } from "../../reducers";
import { CommonContext } from "./CommonContext";
import "./Overlay.scss";

// ------------------------------------------------------------------

const TRANSITION_TIMEOUT = 300;

// ------------------------------------------------------------------

export const Overlay: FC = () => {
	const { onModalPop } = useContext(CommonContext);
	const renderer = useSelector<RootState, (() => ReactNode) | null>(state =>
		state.modals.renderers.length > 0
			? state.modals.renderers[state.modals.renderers.length - 1]
			: null
	);

	const currRenderer = useRef<(() => ReactNode) | null>(null);

	const [showModal, setShowModal] = React.useState(false);

	useEffect(() => {
		const keyDown = (e: KeyboardEvent) => {
			if (e.keyCode === 27) {
				onModalPop();
			}
		};

		document.addEventListener("keydown", keyDown);

		return () => {
			document.removeEventListener("keydown", keyDown);
		};
	}, [onModalPop]);

	useEffect(() => {
		if (currRenderer.current && renderer) {
			setShowModal(false);
			setTimeout(() => {
				currRenderer.current = renderer;
				setShowModal(true);
			}, TRANSITION_TIMEOUT);
		} else if (currRenderer.current) {
			setShowModal(false);
			setTimeout(() => {
				currRenderer.current = null;
			}, TRANSITION_TIMEOUT);
		} else if (renderer) {
			currRenderer.current = renderer;
			setShowModal(true);
		}
	}, [currRenderer, renderer]);

	return (
		<CSSTransition
			in={showModal}
			timeout={TRANSITION_TIMEOUT}
			unmountOnExit={true}>
			<div
				className="Overlay"
				onClick={e => {
					// Clicking overlay will close currently displayed element
					e.stopPropagation();
					onModalPop();
				}}>
				{currRenderer.current && (
					<div
						className="OverlayWrapper"
						role="dialog"
						onClick={(e: MouseEvent) => {
							// Clicking wrapper will not progagate to overlay which would close currently displayed element
							e.stopPropagation();
						}}>
						{currRenderer.current()}
					</div>
				)}
			</div>
		</CSSTransition>
	);
};
