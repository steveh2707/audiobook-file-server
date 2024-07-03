import fs from 'fs';
import path from 'path';
import mv from 'mv';

export class Mover {
    SUPERSEDED_FOLDER = "_ss"
    REGEX_PATTERN = /^(.*) \((\d{2}) of (\d{2})\)\.(mp3|m4b)$/;

    moveProcessedFiles(dirPath) {
        const processedDir = path.join(dirPath, this.SUPERSEDED_FOLDER);
        if (!fs.existsSync(processedDir)) {
            fs.mkdirSync(processedDir);
        }

        fs.readdirSync(dirPath).forEach(filename => {
            if (this.REGEX_PATTERN.test(filename)) {
                const src = path.join(dirPath, filename);
                const dest = path.join(processedDir, filename);
                fs.renameSync(src, dest);
            }
        });
        console.log(`Moved files: ${dirPath} to ${this.SUPERSEDED_FOLDER} folder`)
    }

}