const ILovePDFApi = require("@ilovepdf/ilovepdf-nodejs");
const ilovepdf = new ILovePDFApi(
  "project_public_16d5508162e18df91cb00a58799ce42d_m3K4s377747067212859c2fe0586990b14d19",
  "secret_key_9dfcf999bc676da4f410f56158f2ecb9_oLhjk7ec2f0ae6c2f4f58fc764e629557e677"
);

async function processPdf() {
  let task = ilovepdf.newTask("compress");

  // For this example, await notation will be used instead of
  // promises.

  // Add files to task for upload.
  await task.addFile("path/to/file1_name.pdf");
  await task.addFile("path/to/file2_name.pdf");
  await task.addFile("path/to/file3_name.pdf");

  // Execute the task.
  await task.process();

  // Download the packaged files.
  const data = await task.download();
}
