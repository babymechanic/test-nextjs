import { Readable } from 'stream';
import busboy from 'busboy';
import { Opts, UploadedFile, UploadedFileError } from './multi-part-definitions';
import sharp from 'sharp';

function createError(info: busboy.FileInfo, fieldName: string): UploadedFileError {
  return {...info, fieldName, status: 'Limit exceeded'};
}

function createSuccess(info: busboy.FileInfo, fieldName: string, buffer: Buffer): UploadedFile {
  return {...info, fieldName, status: 'Success', fileContent: buffer};
}

export function createFileFromStream(stream: Readable, outputBuffer: Promise<Buffer>, info: busboy.FileInfo, fieldName: string): Promise<UploadedFileError | UploadedFile> {
  return new Promise<UploadedFileError | UploadedFile>((resolve, reject) => {
    let limitExceeded = false;

    stream.on('limit', () => {
      limitExceeded = true;
    });

    stream.on('close', () => {
      outputBuffer.then((buffer) => limitExceeded ? createError(info, fieldName) : createSuccess(info, fieldName, buffer))
                  .then((result) => resolve(result))
                  .catch((e) => {
                    if (limitExceeded && e.message?.includes('VipsJpeg: Premature end of input file')) {
                      resolve(createError(info, fieldName));
                    } else {
                      reject(e);
                    }
                  })
    });
  });
}


export function createSharpBuffer(info: busboy.FileInfo, sharpStream: sharp.Sharp, opts: Opts): Promise<Buffer> | undefined {
  const mimeType = opts.mimeTypes[info.mimeType];
  return mimeType?.sharpStream(sharpStream)?.toBuffer();
}

