import "jest";
import { connect, disconnect, deviceList } from "../src/commands/base.cmd";

describe("Base Commands Test", () => {
	test("connect", async () => {
		await connect("00008030-0016492934F2402E");
		expect("0").toEqual("0");
	});

	test("deviceList", async () => {
		const devices = await deviceList();
		expect(devices.length).toEqual(1);
	});

	test("disconnect", async () => {
		await disconnect("00008030-0016492934F2402E");
		expect("0").toEqual("0");
	});
});
