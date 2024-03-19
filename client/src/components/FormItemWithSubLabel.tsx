import { Form, FormItemProps } from "antd";
import "./FormItemWithSubLabel.css";

interface FormItemLabelWithSubLabelProps {
	label: string;
	isRequired: boolean;
	subLabel?: string;
	subLabelRender?: () => JSX.Element;
}

const FormItemLabelWithSubLabel = ({
	label,
	isRequired,
	subLabel,
	subLabelRender,
}: FormItemLabelWithSubLabelProps) => (
	<div className="ant-form-item">
		<div className="ant-form-item-label">
			<label className={isRequired ? "ant-form-item-required" : ""}>{label}</label>
		</div>
		{subLabelRender && subLabelRender()}
		{!subLabelRender && <div className="text-xs text-gray-500">{subLabel}</div>}
	</div>
);

interface CustomFormItemProps extends Omit<FormItemProps, "label"> {
	label: string;
	subLabel?: string;
	subLabelRender?: () => JSX.Element;
}
const FormItemWithSublabel = ({
	label,
	subLabel,
	subLabelRender,
	children,
	...restProps
}: CustomFormItemProps) => {
	const isRequired = restProps.rules?.some((rule: any) => rule.required) === true;

	return (
		<Form.Item
			required={false} // We handle required in a custom way
			label={
				<FormItemLabelWithSubLabel
					isRequired={isRequired}
					label={label}
					subLabel={subLabel}
					subLabelRender={subLabelRender}
				/>
			}
			{...restProps}
		>
			{children}
		</Form.Item>
	);
};

export default FormItemWithSublabel;
