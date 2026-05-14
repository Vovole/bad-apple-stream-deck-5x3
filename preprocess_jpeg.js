const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = "frames";
const outputDir = "jpeg";

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

async function main() {

    const files = fs.readdirSync(inputDir);

    for (const file of files) {

        const inputPath = path.join(inputDir, file);

        const outputPath = path.join(
            outputDir,
            path.parse(file).name + ".jpg"
        );

        await sharp(inputPath)
            .resize(72, 72)
            .jpeg({
                quality: 95
            })
            .toFile(outputPath);

        console.log("DONE:", file);
    }
}

main();