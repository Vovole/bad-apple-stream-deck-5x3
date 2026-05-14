const StreamDeck = require("elgato-stream-deck");
const fs = require("fs");
const path = require("path");

const deck = StreamDeck.openStreamDeck();

const compiledDir =
    path.join(__dirname, "compiled");

const outputDir =
    path.join(__dirname, "packets");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const originalWrite =
    deck.device.write.bind(deck.device);

deck.device.write = function(packet)
{
    if (!global.currentPacketDir)
        return originalWrite(packet);

    const packetPath =
        path.join(
            global.currentPacketDir,
            `${global.packetIndex}.bin`
        );

    fs.writeFileSync(packetPath, packet);

    global.packetIndex++;

    return originalWrite(packet);
};

async function build()
{
    const frames =
        fs.readdirSync(compiledDir)
        .sort((a, b) => Number(a) - Number(b));

    for (const frame of frames)
    {
        console.log(
            `BUILD FRAME ${frame}`
        );

        const framePath =
            path.join(compiledDir, frame);

        const frameOutput =
            path.join(outputDir, frame);

        if (!fs.existsSync(frameOutput)) {
            fs.mkdirSync(frameOutput);
        }

        for (let key = 0; key < 15; key++)
        {
            global.packetIndex = 0;

            global.currentPacketDir =
                path.join(
                    frameOutput,
                    `key${key}`
                );

            if (
                !fs.existsSync(
                    global.currentPacketDir
                )
            ) {
                fs.mkdirSync(
                    global.currentPacketDir
                );
            }

            const buffer =
                fs.readFileSync(
                    path.join(
                        framePath,
                        `${key}.bin`
                    )
                );

            deck.fillImage(key, buffer);
        }
    }

    console.log("DONE");

    process.exit(0);
}

build();