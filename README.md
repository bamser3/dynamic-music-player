# My Music Player

A dynamic music player using Tailwind CSS, HTML, and JavaScript.

## Folder Structure

```
my-music-player/
├── src/
│   ├── css/
│   │   └── input.css         
│   ├── js/
│   │   └── main.js           
│   ├── images/               # Album covers, icons
│   │   ├── residential.jpg
│   │   ├── wassup.jpg
│   │   └── cgeskyte.jpg
│   └── index.html            
├── audio/
│   ├── residential.mp3
│   ├── wassup.mp3
│   └── cantgetenough.mp3
├── tailwind.config.js         
├── package.json               
├── package-lock.json         
└── README.md                  

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
