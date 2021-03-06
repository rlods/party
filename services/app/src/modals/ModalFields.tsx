import React, { FC, forwardRef, useContext } from "react";
import { useTranslation } from "react-i18next";
//
import { IconButton } from "../components/Common/IconButton";
import { CommonContext } from "../components/Common/CommonContext";

// ------------------------------------------------------------------

export const ModalField = ({ children }: { children?: React.ReactNode }) => (
	<div className="ModalField">{children}</div>
);

// ------------------------------------------------------------------

export const InputField = forwardRef(
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

export const SecretField: FC<{
	id: string;
	label: string;
	onChange: (value: string) => void;
	placeholder: string;
	value: string;
}> = ({ id, label, onChange, placeholder, value }) => {
	const { onCopyToClipboard } = useContext(CommonContext);
	const { t } = useTranslation();

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
						onClick={() => onCopyToClipboard(value)}
						size="M"
						title={t("copy_to_clipboard")}
					/>
				</div>
			</div>
		</ModalField>
	);
};

// ------------------------------------------------------------------

export const SelectField = forwardRef(
	(
		props: {
			label: string;
			options: Array<{ id: string; label: string }>;
		} & React.DetailedHTMLProps<
			React.InputHTMLAttributes<HTMLSelectElement>,
			HTMLSelectElement
		>,
		ref: React.Ref<HTMLSelectElement>
	) => (
		<ModalField>
			<div className="XXX">
				<label htmlFor={props.id}>{props.label}</label>
				<select ref={ref} {...props}>
					{props.options
						.sort((a, b) => a.label.localeCompare(b.label))
						.map(option => (
							<option key={option.id} value={option.id}>
								{option.label}
							</option>
						))}
				</select>
			</div>
		</ModalField>
	)
);
