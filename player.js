const StreamDeck =
    require("elgato-stream-deck");

const fs = require("fs");
const path = require("path");

const deck =
    StreamDeck.openStreamDeck();

const packetsDir =
    path.join(__dirname, "packets");

const frames =
    fs.readdirSync(packetsDir)
    .sort((a, b) => Number(a) - Number(b));

function sleep(ms)
{
    return new Promise(
        r => setTimeout(r, ms)
    );
}

let running = true;

deck.on("down", () => {

    running = false;

    deck.clearAllKeys();

    process.exit(0);
});

async function play()
{

    const fps = 20;

    const frameTime = 1000 / fps;

    while (running)
    {
        for (const frame of frames)
        {
            const start =
                performance.now();

            const framePath =
                path.join(
                    packetsDir,
                    frame
                );

            for (
                let key = 0;
                key < 15;
                key++
            )
            {
                const keyPath =
                    path.join(
                        framePath,
                        `key${key}`
                    );

                const packets =
                    fs.readdirSync(keyPath)
                    .sort(
                        (a, b) =>
                        Number(a.split(".")[0]) -
                        Number(b.split(".")[0])
                    );

                for (const packet of packets)
                {
                    const data =
                        fs.readFileSync(
                            path.join(
                                keyPath,
                                packet
                            )
                        );

                    deck.device.write(data);
                }
            }

            const elapsed =
                performance.now() - start;

            const remaining =
                frameTime - elapsed;

            await sleep(
                Math.max(1, remaining)
            );
        }
    }
}

play();