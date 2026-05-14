# Bad Apple on Stream Deck

Play videos directly on a 5x3 Elgato Stream Deck using Node.js and precompiled HID packets.

This project converts video frames into real Stream Deck HID packets ahead of time, allowing extremely lightweight real-time playback with minimal CPU usage.

---

# Features

* Real-time video playback on Stream Deck
* Precompiled HID packet system
* Extremely low CPU usage during playback
* No real-time JPEG encoding
* No real-time image conversion
* Automatic stop on key press
* Optimized for 5x3 Stream Deck devices
* Uses the official Stream Deck SDK internally

---

# Requirements

* Windows
* Node.js
* FFmpeg
* Elgato Stream Deck software
* Elgato Stream Deck (5x3)

---

# Installation

Clone the repository:

```bash id="fkm7w1"
git clone https://github.com/YOUR_USERNAME/streamdeck-video-player.git
cd streamdeck-video-player
```

Install dependencies:

```bash id="4q7fph"
npm install
```

---

# Important SDK Modification

This project requires modifying the internal Stream Deck SDK in order to dump and reuse the generated HID packets.

Open the following file:

```txt id="x7o5dy"
node_modules/elgato-stream-deck/dist/models/base.js
```

Find:

```js id="5wyt6m"
for (const packet of packets) {
    this.device.write(packet);
}
```

Replace it with:

```js id="u3r0tk"
const fs = require("fs");

let index = Date.now();

for (const packet of packets)
{
    fs.writeFileSync(
        `packet_${index}_${keyIndex}.bin`,
        packet
    );

    this.device.write(packet);

    index++;
}
```

This allows the project to:

* intercept the real HID packets
* save them to disk
* reuse them later for optimized playback

* base.js is in the repo then you can fully replace it
---

# Video Preparation

Place your video inside the project folder:

```txt id="jlwm0h"
badapple.mp4
```

Use the frames directory:

Extract video frames using FFmpeg:

```bash id="1s0dy9"
ffmpeg -i badapple.mp4 -vf scale=360:216,fps=20 frames/frame_%05d.png
```

This will:

* Resize the video to Stream Deck resolution
* Convert the video into PNG frames
* Generate sequential frame names

---

# Frame Compilation

Run:

```bash id="e3cwq2"
node preprocess.js
```

This converts all PNG frames into raw binary buffers.

A new folder will be created:

```txt id="fw8tvy"
compiled/
```

Each frame contains:

```txt id="csk5mp"
0.bin
1.bin
2.bin
...
14.bin
```

Each `.bin` file represents one Stream Deck key image.

---

# HID Packet Compilation

Run:

```bash id="e7aqqm"
node build_packets.js
```

This step:

* Loads every compiled frame
* Uses the official Stream Deck SDK
* Generates real HID packets
* Saves all packets to disk

A new folder will be created:

```txt id="9g0jpc"
packets/
```

Packet structure:

```txt id="zb2ydm"
packets/
├── 0/
│   ├── key0/
│   ├── key1/
│   ├── ...
├── 1/
├── 2/
...
```

Each folder contains the exact HID packets sent to the Stream Deck.

---

# Start Playback

Run:

```bash id="d6jd2t"
node player.js
```

The video will immediately start playing on the Stream Deck.

Press any key on the Stream Deck to stop playback.

---

# Full Workflow

```bash id="76m4jg"
npm install

ffmpeg -i badapple.mp4 -vf scale=360:216,fps=20 frames/frame_%05d.png

node preprocess.js

node build_packets.js

node player.js
```

---

# Why Precompiled Packets?

Normally, the Stream Deck SDK performs:

```txt id="tks2dv"
RGB conversion
↓
JPEG encoding
↓
HID packet generation
↓
USB transmission
```

for every frame during playback.

This project moves all heavy processing into an offline build step.

During playback, the runtime only performs:

```txt id="ig2dzy"
Read packet
↓
Send packet
```

This greatly reduces CPU usage and improves playback stability.

---

# Project Structure

```txt id="6os7ur"
streamdeck-video-player/
├── compiled/
├── frames/
├── packets/
├── build_packets.js
├── player.js
├── preprocess.js
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

---

# Recommended .gitignore

Create a `.gitignore` file:

```gitignore id="6cku97"
node_modules/

frames/
compiled/
packets/

*.mp4
*.gif
*.zip
```

---

# Controls

| Action                    | Result        |
| ------------------------- | ------------- |
| Press any Stream Deck key | Stop playback |

---

# Performance Notes

Playback performance depends on:

* USB bandwidth
* SSD speed
* Stream Deck model
* Target FPS

Recommended:

```txt id="ww0mlh"
20 FPS
```

Since all packets are precompiled, playback is significantly lighter than real-time image processing approaches.

---

# Technologies Used

* Node.js
* elgato-stream-deck
* FFmpeg
* HID USB communication

---

# License

This project is for educational and experimental purposes.

---

# Credits

Original video:

Bad Apple!! / Touhou Project
