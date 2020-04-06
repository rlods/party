import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
//
import { copyToClipboard } from "../../utils/clipboard";
import { IconButton } from "../Common/IconButton";
import { displayMessage } from "../../actions/messages";
import { useDispatch } from "react-redux";

// ------------------------------------------------------------------

export const SecretField = ({
	id,
	label,
	onChange,
	placeholder,
	value
}: {
	id: string;
	label: string;
	onChange: (value: string) => void;
	placeholder: string;
	value: string;
}) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const onCopyToClipboard = useCallback(async () => {
		await copyToClipboard(value);
		dispatch(displayMessage("info", t("secret_copied_to_clipboard")));
	}, [dispatch, t, value]);

	return (
		<div className="ModalField">
			<label htmlFor={id}>{label}</label>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between"
				}}>
				<input
					style={{
						flexGrow: 1,
						marginRight: "0.5rem"
					}}
					id={id}
					type="password"
					autoComplete="password"
					placeholder={placeholder}
					maxLength={36}
					minLength={36}
					required={true}
					value={value}
					onChange={e => onChange(e.target.value)}
				/>
				<IconButton
					icon="clipboard"
					onClick={onCopyToClipboard}
					size="M"
					title={`Copy to Clipboard`}
				/>
			</div>
		</div>
	);
};
