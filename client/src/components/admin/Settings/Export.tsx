import { ImportExportService } from "@/services/importExportService";
import { ClientError } from "@/types/ClientError";
import { ClientSuccess } from "@/types/ClientSuccess";
import { Alert, Button } from "antd";
import { useState } from "react";

const Export = () => {
	const [isExporting, setIsExporting] = useState<boolean>(false);

	const handleExportClick = async () => {
		try {
			setIsExporting(true);

			const blob = await ImportExportService.export();
			if (!(blob instanceof Blob)) {
				throw new Error("Export failed");
			}

			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "export.zip";
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);

			ClientSuccess.toast("Exported successfully");
		} catch (error) {
			console.error(error);
			new ClientError(error).toast();
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="flex flex-col gap-10">
			<Alert
				description="Export challenge data from this page to a ZIP file. This ZIP file can be used later to import challenge data back into the system. This does not include user data or attempt data."
				type="info"
				showIcon
			/>
			<div className="flex gap-2 w-full">
				<Button
					loading={isExporting}
					onClick={handleExportClick}
					className="w-full"
					type="primary"
				>
					Export
				</Button>
			</div>
		</div>
	);
};

export default Export;
