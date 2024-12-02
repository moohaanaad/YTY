import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid'


export const dS = (dest: string) => {
    return diskStorage({
        destination: `${dest}`, // Folder where files are saved
        filename: (req, file, cb) => {
            const uniqueSuffix = uuidv4()
            const originalName = uniqueSuffix + "_" + file.originalname; // Replace spaces for safety
            cb(null, `${originalName}`);
        }
    })
}