import { createContext, ReactNode } from "react";
//
import { MessageOptions } from "../../actions/messages";

// ------------------------------------------------------------------

export type CommonContextProps = {
	onCopyToClipboard: (value: string) => void;
	onDisplayError: (text: string, options?: MessageOptions) => void;
	onDisplayInfo: (text: string, options?: MessageOptions) => void;
	onMessagesClear: (tag?: string) => void;
	onMessagesRemove: (ids: ReadonlyArray<number>) => void;
	onModalClose: () => void;
	onModalOpen: (render: () => ReactNode) => void;
	onModalPop: () => void;
};

// ------------------------------------------------------------------

export const CommonContext = createContext<CommonContextProps>({
	onCopyToClipboard: () => {},
	onDisplayError: () => {},
	onDisplayInfo: () => {},
	onMessagesClear: () => {},
	onMessagesRemove: () => {},
	onModalClose: () => {},
	onModalOpen: () => {},
	onModalPop: () => {}
});
