import logger from "../utils/logger";
import which from "which";
import { IDB_COMPANION_EXEC, IDB_EXEC } from "../utils/constant";
import { exec } from "teen_process";
import { delay } from "../utils/utils";

const connect = async (udid: string) => {
	try {
		await which(IDB_EXEC);
	} catch (e) {
		logger.error(e);
		throw new Error(`Couldn't find ${IDB_EXEC} executable in your PATH. is it installed? Read https://www.fbidb.io`);
	}

	try {
		await which(IDB_COMPANION_EXEC);
	} catch (e) {
		logger.error(e);
		throw new Error(`Couldn't find ${IDB_COMPANION_EXEC} executable in your PATH. is it installed? Read https://www.fbidb.io`);
	}

	logger.info(`start and connect companion: '${IDB_EXEC}'`);

	try {
		await exec(IDB_EXEC, ["connect", udid]);
	} catch (e) {
		logger.error(e);
		await delay(2000);
		await disconnect(udid);
		await exec(IDB_EXEC, ["connect", udid]);
	}
};

const disconnect = async (udid: string) => {
	try {
		await exec(IDB_EXEC, ["disconnect", udid]);
	} catch (e) {
		logger.error(e);
	}
};

const deviceList = async () => {
	var connectedDevicesList = new Array();
	try {
		const { stdout, stderr, code } = await exec(IDB_EXEC, ["list-targets", "--json"]);
		if (stdout) {
			let devices = stdout.split("\n");
			devices.pop();
			for (const d of devices) {
				const device = JSON.parse(d);
				if (device.type == "device") {
					connectedDevicesList.push(device);
				}
			}
		}
	} catch (e) {
		logger.error(e);
	}
	return connectedDevicesList;
};

export { connect, disconnect, deviceList };
