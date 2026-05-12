# Bad Apple on Stream Deck

Play Bad Apple!! directly on a 5x3 Elgato Stream Deck using Node.js and raw HID communication.

This project converts a video into optimized binary frame buffers and streams them in real time to the Stream Deck screens.

---

# Features

* Real-time video playback on Stream Deck
* Optimized precompiled frame buffers
* Hidden launcher (no console window)
* Automatic stop on key press
* Lightweight runtime playback
* Works with standard 5x3 Stream Deck models

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

```bash
git clone https://github.com/YOUR_USERNAME/badapple-streamdeck.git
cd badapple-streamdeck
```

Install dependencies:

```bash
npm install
```

---

# Video Preparation

Place your video inside the project folder:

```txt
badapple.mp4
```

Create the frames directory:

```bash
mkdir frames
```

Extract video frames using FFmpeg:

```bash
ffmpeg -i badapple.mp4 -vf scale=360:216,fps=20 frames/frame_%05d.png
```

This will:

* Resize the video to Stream Deck resolution
* Convert the video into PNG frames
* Generate sequential frame names

---

# Frame Compilation

Run:

```bash
node preprocess.js
```

This converts all PNG frames into optimized binary buffers.

A new folder will be created:

```txt
compiled/
```

These files are used for ultra-fast playback.

---

# Start Playback

Run:

```bash
node index.js
```

The video will immediately start playing on the Stream Deck.

Press any key on the Stream Deck to stop playback.

---

# Hidden Launch

Run:

```txt
launch_hidden.vbs
```

This starts playback without opening a console window.

You can assign this file directly to a Stream Deck button.

---

# Project Structure

```txt
badapple-streamdeck/
├── compiled/
├── frames/
├── index.js
├── preprocess.js
├── launch_hidden.vbs
├── package.json
├── package-lock.json
└── README.md
```

---

# Recommended .gitignore

Create a `.gitignore` file:

```gitignore
node_modules/
frames/
compiled/
*.mp4
```

---

# Controls

| Action                     | Result                |
| -------------------------- | --------------------- |
| Press any Stream Deck key  | Stop playback         |
| Launch `launch_hidden.vbs` | Start playback hidden |

---

# Performance Notes

Playback performance depends on:

* USB bandwidth
* SSD speed
* Stream Deck model
* Target FPS

Recommended:

```txt
20 FPS
```

Higher framerates may cause:

* frame skipping
* USB bottlenecks
* unstable playback

---

# Technologies Used

* Node.js
* elgato-stream-deck
* FFmpeg
* Sharp
* HID USB communication

---

# License

This project is for educational and experimental purposes.

---

# Credits

Original video:

Bad Apple!! / Touhou Project
