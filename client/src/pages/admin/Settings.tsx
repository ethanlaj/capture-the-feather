import React from "react";
import { ExportOutlined, FieldTimeOutlined, ImportOutlined, StarOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { SelectInfo } from "rc-menu/lib/interface";
import StartEndTime from "@/components/admin/Settings/StartEndTime";
import Badges from "@/components/admin/Settings/Badges";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: "group"
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
	} as MenuItem;
}

const items: MenuItem[] = [
	getItem("Start/End Time", "1", <FieldTimeOutlined />),
	getItem("Badges", "2", <StarOutlined />),
	getItem("Export", "3", <ExportOutlined />),
	getItem("Import", "4", <ImportOutlined />),
];

const Settings: React.FC = () => {
	const [selectedItemComponent, setSelectedItemComponent] =
		React.useState<React.ReactNode | null>(<StartEndTime />);

	const handleMenuItemSelect = (e: SelectInfo) => {
		switch (e.key) {
			case "1":
				return setSelectedItemComponent(<StartEndTime />);
			case "2":
				return setSelectedItemComponent(<Badges />);
			case "3":
				return setSelectedItemComponent(<div>Export</div>);
			case "4":
				return setSelectedItemComponent(<div>Import</div>);
			default:
				return null;
		}
	};

	return (
		<div className="flex gap-10">
			<div style={{ width: 256 }}>
				<Menu
					defaultSelectedKeys={["1"]}
					defaultOpenKeys={["sub1"]}
					mode="inline"
					items={items}
					onSelect={handleMenuItemSelect}
				/>
			</div>
			<div>{selectedItemComponent}</div>
		</div>
	);
};

export default Settings;
