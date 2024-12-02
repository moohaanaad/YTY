import { BadRequestException } from "@nestjs/common";


type fileT = {

    /** Field name specified in the form */
    fieldname: string;
    /** Name of the file on the user's computer */
    originalname: string;
    /** Encoding type of the file */
    encoding: string;
    /** Mime type of the file */
    mimetype: string;
    /** Size of the file in bytes */
    size: number;
    /** The folder to which the file has been saved (DiskStorage) */
    destination: string;
    /** The name of the file within the destination (DiskStorage) */
    filename: string;
    /** Location of the uploaded file (DiskStorage) */
    path: string;
    /** A Buffer of the entire file (MemoryStorage) */
    buffer: Buffer;
}

type cbT = (error: Error | null, acceptFile: boolean) => void

export const fileValidationTypes = {
    image: ['image/png', 'image/jpeg', 'image/jpg'],
    file: ['application/pdf'],
}

export const fileValidation = (allowType: string[]) => {
    return (req: any, file: fileT, cb: cbT) => {
        if (allowType.includes(file.mimetype)) {
            cb(null, true)
        }else{
        cb(new BadRequestException('invaled file formate'), false)
    }}
}
