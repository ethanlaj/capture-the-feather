import { Form } from "antd";

interface FormItemLabelWithSubLabelProps {
	label: string;
	subLabel: string;
}

const FormItemLabelWithSubLabel = ({ label, subLabel }: FormItemLabelWithSubLabelProps) => (
	<div>
		<div>{label}</div>
		<div className="text-xs text-gray-500">{subLabel}</div>
	</div>
);

interface CustomFormItemProps {
	name: string;
	rules: any[];
	label: string;
	subLabel: string;
	children: React.ReactNode;
}
const FormItemWithSublabel = ({ name, rules, label, subLabel, children }: CustomFormItemProps) => {
	return (
		<Form.Item
			label={<FormItemLabelWithSubLabel label={label} subLabel={subLabel} />}
			name={name}
			rules={rules}
		>
			{children}
		</Form.Item>
	);
};

export default FormItemWithSublabel;
