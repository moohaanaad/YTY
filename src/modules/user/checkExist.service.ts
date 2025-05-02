import { ConflictException, Injectable } from "@nestjs/common";
import { deleteFile } from "src/common";
import { UserRepository } from "src/models/user/user.repository";

@Injectable()
export class CheckExistService {
    constructor(private userRepo: UserRepository) { }
    async checkAndUpdate( property:string, value: string, conflictMessage: string, file: Express.Multer.File) {
        
        const filter = { [property]: value };
        const conflict = await this.userRepo.findOne(filter);
        
        if (conflict) {
            if (file) deleteFile(file.path); // Clean up uploaded file
            throw new ConflictException(conflictMessage);
        }
        return  value; // Update user field if no conflict

    };
}