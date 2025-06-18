# Modern Music Player

A beautiful, responsive web-based music player that lets you play music from your local files with a modern and intuitive interface.

![Music Player Preview](./src/assets/album-cover.jpg)

## Features

- 🎵 Play local music files (MP3, WAV, OGG)
- 🎨 Modern, responsive design with animations
- 📱 Works on desktop and mobile devices
- 📂 Drag and drop support for music files
- ⌨️ Keyboard shortcuts
- 🔊 Volume control
- 📊 Progress bar with seeking capability
- 📝 Dynamic playlist management

## Project Structure

```
music-player
├── src
│   ├── assets
│   │   └── icons
│   │       ├── next.svg
│   │       ├── pause.svg
│   │       └── play.svg
│   ├── js
│   │   ├── app.js
│   │   ├── player.js
│   │   └── playlist.js
│   ├── styles
│   │   └── main.css
│   └── index.html
├── package.json
└── README.md
```

## How to Start

1. Make sure you have [Node.js](https://nodejs.org/) installed on your computer
2. Open a terminal/PowerShell window
3. Navigate to the project directory:
   ```powershell
   cd "path\to\music-player"
   ```
4. Install dependencies:
   ```powershell
   npm install
   ```
5. Start the application:
   ```powershell
   npm start
   ```
6. The music player will automatically open in your default browser
   (If it doesn't, go to http://localhost:8080 manually)

## How to Use

1. **Adding Music**
   - Click the file input area at the top of the player
   - OR drag and drop music files directly onto the player
   - Supported formats: MP3, WAV, OGG, and other browser-supported audio formats

2. **Playback Controls**
   - ▶️/⏸️ Play/Pause button in the center
   - ⏮️ Previous track button on the left
   - ⏭️ Next track button on the right
   - Use the progress bar to seek within the current track
   - Adjust volume using the volume slider

3. **Keyboard Shortcuts**
   - Space: Play/Pause
   - Left Arrow: Previous track
   - Right Arrow: Next track

4. **Playlist**
   - Click any song in the playlist to play it
   - Currently playing song is highlighted
   - Scroll through playlist for more songs

## Technical Features

- Responsive design that works on all screen sizes
- Gradient background with frosted glass effect
- Smooth animations and transitions
- Custom scrollbar styling
- Drag and drop file support
- Real-time progress updates
- Error handling for unsupported files

## Browser Support

Works best in modern browsers:
- Chrome (recommended)
- Firefox
- Edge
- Safari

## Troubleshooting

1. **Music won't play**
   - Make sure you're using supported audio formats
   - Check if your browser supports the audio format
   - Verify that the file isn't corrupted

2. **Player doesn't load**
   - Make sure you've installed dependencies (`npm install`)
   - Check if the port 8080 is available
   - Try clearing your browser cache

3. **Drag and drop not working**
   - Ensure you're dropping audio files
   - Try using the file input button instead
   - Check if your browser supports drag and drop

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

MIT License - feel free to use, modify, and distribute as needed!