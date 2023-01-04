// import { expect } from "chai";
// // import { exec } from 'child_process';
// import { mock, stub } from "sinon";
// import * as util from "util";
// import { run } from "../src";
// import { getConfig } from "../src/config";
// const exec = util.promisify(require("child_process").exec);
//
// describe("src/index", function () {
//   it("should log load messages", async () => {
//
//     const consoleLogStub = stub(console, 'info');
//     // const configStub = mock(getConfig);
//     await run();
//
//     expect(consoleLogStub.calledThrice);
//
//     await killApp();
//   });
// });
//
// async function killApp() {
//   try {
//     const { stdout, stderr } = await exec("lsof -i tcp:3000 | grep 'node'");
//     if (stdout) {
//       const pid = stdout.split(' ')[4];
//       try {
//         await exec(`kill -9 ${pid}`);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//     console.error(stderr);
//   } catch (e) {
//     console.error(e);
//   }
// }
