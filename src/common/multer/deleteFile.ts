import { existsSync } from 'fs';
import { unlink } from 'fs/promises'

export const deleteFile = async (fullPath: string) => {
    if (!existsSync(fullPath)) return;
    await unlink(fullPath);
  };