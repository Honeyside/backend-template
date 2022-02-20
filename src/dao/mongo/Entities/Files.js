import { createModel } from 'mongoose-gridfs';

const saveFile = async (stream, options, md5) => {
  return new Promise((resolve, reject) => {
    const File = createModel({ writeConcern: { w: 1 } });
    File.findOne({ md5 }, (findError, foundFile) => {
      if (findError) {
        reject(findError);
      } else if (foundFile) {
        resolve(foundFile);
      } else {
        File.write(options, stream, (writeError, newFile) => {
          if (writeError) {
            reject(writeError);
          } else {
            resolve(newFile);
          }
        });
      }
    });
  });
};

const Files = { saveFile };

export default Files;
