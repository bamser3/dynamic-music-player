# My Music Player

A dynamic music player using Tailwind CSS, HTML, and JavaScript.

## Demo

[Try it out](https://bamser3.github.io/dynamic-music-player/)

<img width="2277" height="1504" alt="image" src="https://github.com/user-attachments/assets/f0ddff22-1244-4b7b-84db-30f69947279d" />


## Folder Structure

```
my-music-player/
├── bin
│   └── output.css
├── package.json
└── src
    ├── assets
    │   ├── buttons.html
    │   ├── next.svg
    │   ├── pause.svg
    │   ├── play.svg
    │   └── prev.svg
    ├── audio
    │   ├── iwidb.mp3
    │   ├── tacticalRetreat.mp3
    │   └── timeWithin.mp3
    ├── css
    │   └── input.css
    ├── images
    │   ├── cat.jpeg
    │   ├── iwidbCover.jpg
    │   ├── nurture.jpg
    │   ├── tacticalRetreatCover.jpg
    │   ├── timeWithinCover.jpg
    │   └── tylerGill.jpg
    ├── index.html
    └── js
        └── main.js

8 directories, 19 files
                  

```

## Setup

1. Install dependencies

```bash
npm install
```
2. Initialize the tailwind css

```bash
npx tailwindcss -i ./src/css/input.css -o ./bin/output.css --watch
```
3. Open `src/index.html` in a browser
