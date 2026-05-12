const StreamDeck = require("elgato-stream-deck");
const fs = require("fs");
const path = require("path");

const deck = StreamDeck.openStreamDeck();

const compiledDir = path.join(__dirname, "compiled");

const frames = fs.readdirSync(compiledDir)
    .sort((a, b) => Number(a) - Number(b));

let running = true;

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}


deck.on("down", keyIndex => {

    console.log(`STOPPED ON KEY ${keyIndex}`);

    running = false;

    deck.clearAllKeys();

    process.exit(0);
});

async function play() {

    console.log("PLAYING");

    const targetFPS = 20;
    const frameTime = 1000 / targetFPS;

    while (running) {

        for (const frame of frames) {

            if (!running) return;

            const start = performance.now();

            const framePath = path.join(compiledDir, frame);

            for (let key = 0; key < 15; key++) {

                const buffer = fs.readFileSync(
                    path.join(framePath, `${key}.bin`)
                );

                deck.fillImage(key, buffer);
            }

            const elapsed = performance.now() - start;

            const remaining = frameTime - elapsed;


            await sleep(Math.max(1, remaining));
        }
    }
}

play();
