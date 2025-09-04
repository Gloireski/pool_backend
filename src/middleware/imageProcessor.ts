import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function processImage(inputPath: string, outputPath: string) {
  try {
    const samePath = path.resolve(inputPath) === path.resolve(outputPath);
    const finalOutput = samePath
      ? path.join(path.dirname(outputPath), `${path.basename(outputPath, path.extname(outputPath))}-proc.jpg`)
      : outputPath;

    await sharp(inputPath)
      .jpeg({ quality: 85 })
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .toFile(finalOutput);

    // Replace original if we wrote to a temp file
    if (samePath) {
      fs.unlinkSync(inputPath);
      fs.renameSync(finalOutput, outputPath);
    } else {
      // Remove original file after processing
      fs.unlinkSync(inputPath);
    }

    return true;
  } catch (error) {
    console.error('[image] processing error:', error);
    return false;
  }
}

export function getImageUrl(filename: string): string {
  return `/downloads/${filename}`;
}
