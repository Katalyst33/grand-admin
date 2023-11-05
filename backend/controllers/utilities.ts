import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs/ILovePDFApi";
import ImagePdfTask from "@ilovepdf/ilovepdf-js-core/tasks/ImagePdfTask";
import ILovePDFFile from "@ilovepdf/ilovepdf-js-core/utils/ILovePDFFile";
import fs from "fs";
import UploadedFile from "@xpresser/file-uploader/js/src/UploadedFile";
import env from "../configs/env";



const instance = new ILovePDFApi(env.PDF_PUBLIC_KEY, env.PDF_SECRET_KEY);

const task = instance.newTask("imagepdf") as ImagePdfTask;

export async function ImageToPdf(file: UploadedFile) {
  task
    .start()
    .then(() => {
      console.log("add");
      const pdfFile = new ILovePDFFile(file.path!);
      return task.addFile(pdfFile);
    })
    .then(() => {
      console.log("process");

      return task.process({ merge_after: true });
    })
    .then(() => {
      console.log("downlaod");

      return task.download();
    })
    .then((data) => {
      console.log("done, save");

      fs.writeFileSync(file.path + ".pdf", data);
      return;
    });
}

export async function CompressPdf(file: any) {
  let task = instance.newTask("compress");

  task
    .start()
    .then(() => {
      console.log("add file ");

      const pdffile = new ILovePDFFile(file.path);
      return task.addFile(pdffile);

      // const file = new ILovePDFFIle(fs.writeFileSync(file.path, {}));
      // return task.addFile(`https://eegrandeagle.ngrok.io/uploads/new-doc.pdf`);
    })

    .then(() => {
      console.log("process file ");

      return task.process({ compression_level: "extreme" });
    })
    .then(() => {
      console.log("download file ");

      return task.download();
    })
    .then((data) => {
      console.log("done  file ");

      fs.writeFileSync(file.path, data);
    })
    .catch((e) => {
      return e;
      // console.log(e.response)
    });
}
