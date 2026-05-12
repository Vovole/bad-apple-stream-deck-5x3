const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const WIDTH = 72;
const HEIGHT = 72;

const framesDir = "./frames";
const outputDir = "./compiled";

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const frames = fs.readdirSync(framesDir)
    .filter(f => f.endsWith(".png"))
    .sort();

async function processFrame(frameName, index) {

    const framePath = path.join(framesDir, frameName);

    const frameFolder = path.join(outputDir, index.toString());

    if (!fs.existsSync(frameFolder)) {
        fs.mkdirSync(frameFolder);
    }

    const image = sharp(framePath).removeAlpha();

    for (let y = 0; y < 3; y++) {

        for (let x = 0; x < 5; x++) {

            const keyIndex = y * 5 + x;

            const raw = await image
                .clone()
                .extract({
                    left: x * WIDTH,
                    top: y * HEIGHT,
                    width: WIDTH,
                    height: HEIGHT
                })
                .raw()
                .toBuffer();

            const converted = Buffer.alloc(WIDTH * HEIGHT * 3);

            let j = 0;

            for (let i = 0; i < raw.length; i += 3) {

                // RGB -> BGR
                converted[j++] = raw[i + 2];
                converted[j++] = raw[i + 1];
                converted[j++] = raw[i];
            }

            fs.writeFileSync(
                path.join(frameFolder, `${keyIndex}.bin`),
                converted
            );
        }
    }

    console.log(`DONE ${index + 1}/${frames.length}`);
}

async function main() {

    for (let i = 0; i < frames.length; i++) {

        await processFrame(frames[i], i);
    }

    console.log("ALL DONE");
}

main();