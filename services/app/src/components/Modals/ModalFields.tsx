import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
//
import { copyToClipboard } from "../../utils/clipboard";
import { IconButton } from "../Common/IconButton";
import { displayInfo } from "../../actions/messages";

// ------------------------------------------------------------------

export const ModalField = ({ children }: { children?: React.ReactNode }) => (
	<div className="ModalField">{children}</div>
);

// ------------------------------------------------------------------

export const InputField = React.forwardRef(
	(
		props: { label: string } & React.DetailedHTMLProps<
			React.InputHTMLAttributes<HTMLInputElement>,
			HTMLInputElement
		>,
		ref: React.Ref<HTMLInputElement>
	) => (
		<ModalField>
			<div className="XXX">
				<label htmlFor={props.id}>{props.label}</label>
				<input ref={ref} {...props} />
			</div>
		</ModalField>
	)
);

// ------------------------------------------------------------------

export const SECRET_FIELD_SIZE = 36;

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
		dispatch(displayInfo("secret_copied_to_clipboard"));
	}, [dispatch, value]);

	return (
		<ModalField>
			<div className="XXX">
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
						maxLength={SECRET_FIELD_SIZE}
						minLength={SECRET_FIELD_SIZE}
						required={true}
						value={value}
						onChange={e => onChange(e.target.value)}
					/>
					<IconButton
						icon="clipboard"
						onClick={onCopyToClipboard}
						size="M"
						title={t("copy_to_clipboard")}
					/>
				</div>
			</div>
		</ModalField>
	);
};
