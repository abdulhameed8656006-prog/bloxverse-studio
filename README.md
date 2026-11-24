# BloxVerse Studio

A Roblox Studio-style game maker that runs in the browser and installs as an app (PWA).
Place blocks, spheres, coins, checkpoints, kill bricks and goals in a 3D world, then press **Test Play**
to run around in your game with a blocky character.

**Open it:** https://abdulhameed8656006-prog.github.io/bloxverse-studio/

Companion project: [BloxVerse](https://github.com/abdulhameed8656006-prog/bloxverse-site), a Roblox-style game hub.

> BloxVerse Studio is an independent fan project. It is not affiliated with, endorsed by, or connected to Roblox Corporation.

## Features

- 3D editor with an Explorer list, a Properties panel and a viewport you can orbit, zoom and pan.
- Eight building pieces: Block, Sphere, Cylinder, Spawn, Coin, Kill brick, Checkpoint and Goal.
- Edit name, type, shape, position, size and colour. Nudge buttons move a piece one unit at a time.
- Duplicate and delete pieces.
- **Test Play** with a Roblox-style character: walk, jump, land on parts, collect coins, hit checkpoints, touch kill bricks, reach the goal.
- Save games in the browser, open them later, and export or import them as `.bloxgame.json` files.
- Works on phone and desktop. Installable and usable offline.

## How to make a game

1. Open the app. A small starter game is already there.
2. Tap a piece in the toolbar to add it where the camera is looking. Tap a piece in the viewport to select it.
3. Change its position, size and colour in the Properties panel.
4. Place a **Spawn** where the player starts, some **Coins**, a **Checkpoint**, and a **Goal** to finish.
5. Press **Test Play**. Press **Stop** to go back to the editor.
6. Press **Save** to keep it in this browser, or **Export** to download a file.

## Pieces

| Piece | What it does in Test Play |
| --- | --- |
| Block, Sphere, Cylinder | Solid. You can stand on it and it blocks you from the side. |
| Spawn | Where you start. |
| Coin | Collect it for your score. |
| Kill brick | Touch it and you go back to your last checkpoint. |
| Checkpoint | Touch it to save your respawn spot. |
| Goal | Touch it to win. |

## Controls

| | Editor | Test Play |
| --- | --- | --- |
| Look or orbit | Drag | Drag |
| Zoom | Mouse wheel or pinch | |
| Pan | Right-drag, Shift-drag or two fingers | |
| Select | Tap or click a piece | |
| Move | | Left joystick or W A S D |
| Jump | | JUMP button or Space |
| Delete | Delete key or button | |

## Game file format

```json
{
  "format": "bloxverse-studio",
  "v": 1,
  "name": "My Game",
  "objs": [
    { "n": "Baseplate", "sh": "box", "role": "solid", "x": 0, "y": -0.5, "z": 0, "sx": 80, "sy": 1, "sz": 80, "c": "#4caf50" }
  ]
}
```

`sh` is `box`, `sphere` or `cyl`. `role` is `solid`, `spawn`, `coin`, `kill`, `check` or `goal`.
`x y z` is the centre of the piece and `sx sy sz` is its size.

## Project structure

```
index.html            App shell
css/style.css         Styles
js/studio.js          Editor, file handling and Test Play
vendor/three.min.js   Three.js r128 (stored locally for offline use)
sw.js                 Service worker (offline cache)
manifest.webmanifest  PWA manifest
icons/                192 and 512 px app icons
```

## Run locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000. A service worker needs `localhost` or HTTPS.

## Deploy to GitHub Pages

**Settings > Pages**, source `main` branch and `/ (root)`. The site goes live at `https://abdulhameed8656006-prog.github.io/bloxverse-studio/`.

## Turn it into an Android app with PWABuilder

1. Open [pwabuilder.com](https://www.pwabuilder.com/) and enter `https://abdulhameed8656006-prog.github.io/bloxverse-studio/`.
2. Click **Start**, then **Package for stores**, then **Android**.
3. Use a package ID with letters, numbers and dots only, for example `io.github.abdulhameed8656006.bloxstudio`.
4. Click **Generate**, download the zip, and keep the signing key and its password safe.

The app may show an address bar because the site lives under `/bloxverse-studio/`. Full-screen mode needs a Digital Asset Links file at the domain root.

## Limits

- Games are saved in each browser only. Use Export to move them between devices.
- Test Play is single-player. Parts collide as boxes, even when they look like spheres or cylinders.
- Games made here cannot be published to Roblox. This is a separate, independent tool.

## Ideas for next steps

- Import `.bloxgame.json` games into BloxVerse so they show up in the lobby.
- Moving platforms, scripts, terrain and more part types.
- Undo and redo.
