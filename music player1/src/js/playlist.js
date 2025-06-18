const musicPlayer = {
    audioElement: new Audio(),
    currentTrack: 0,
    songs: [],
    isPlaying: false,

    elements: {
        playBtn: document.getElementById('play-btn'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        songTitle: document.getElementById('song-title'),
        songArtist: document.getElementById('song-artist'),
        albumCover: document.getElementById('album-cover'),
        progressBar: document.getElementById('progress-bar'),
        volumeBar: document.getElementById('volume-bar'),
        playlist: document.getElementById('playlist')
    },

    init() {
        // Get DOM elements
        const selectDirBtn = document.getElementById('select-dir-btn');
        const currentDirText = document.getElementById('current-dir');

        // Check if File System Access API is supported
        if ('showDirectoryPicker' in window) {
            selectDirBtn.addEventListener('click', async () => {
                try {
                    const dirHandle = await window.showDirectoryPicker({
                        mode: 'read',
                        startIn: 'music'
                    });
                    
                    currentDirText.textContent = `Selected: ${dirHandle.name}`;
                    await this.scanDirectory(dirHandle);
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error('Error accessing directory:', err);
                        alert('Error accessing music directory. Please try again.');
                    }
                }
            });
        } else {
            selectDirBtn.textContent = 'Browser Not Supported';
            selectDirBtn.disabled = true;
            currentDirText.textContent = 'Please use a modern browser like Chrome or Edge';
        }
        

        // Add drag and drop support
        const player = document.querySelector('.player');
        player.addEventListener('dragover', (e) => {
            e.preventDefault();
            player.classList.add('drag-over');
        });

        player.addEventListener('dragleave', () => {
            player.classList.remove('drag-over');
        });

        player.addEventListener('drop', (e) => {
            e.preventDefault();
            player.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                this.loadFiles(e.dataTransfer.files);
            }
        });

        // Event listeners
        this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        this.elements.prevBtn.addEventListener('click', () => this.playPrevious());
        this.elements.nextBtn.addEventListener('click', () => this.playNext());
        this.elements.volumeBar.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.elements.progressBar.addEventListener('input', (e) => this.seek(e.target.value));
        fileInput.addEventListener('change', (e) => this.loadFiles(e.target.files));

        // Audio event listeners
        this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
        this.audioElement.addEventListener('ended', () => this.playNext());
        this.audioElement.addEventListener('loadedmetadata', () => {
            this.updateProgress();
        });

        // Set initial volume
        this.setVolume(this.elements.volumeBar.value);

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            } else if (e.code === 'ArrowLeft') {
                this.playPrevious();
            } else if (e.code === 'ArrowRight') {
                this.playNext();
            }
        });
    },

    loadFiles(files) {
        const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
        if (audioFiles.length === 0) {
            alert('Please select audio files only.');
            return;
        }

        this.songs = audioFiles.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name.replace(/\.[^/.]+$/, ""),
            artist: 'Local File'
        }));

        this.updatePlaylist();
        if (this.songs.length > 0) {
            this.playTrack(0);
        }
    },

    updatePlaylist() {
        this.elements.playlist.innerHTML = '';
        this.songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = song.name;
            li.addEventListener('click', () => this.playTrack(index));
            if (index === this.currentTrack) {
                li.classList.add('active');
            }
            this.elements.playlist.appendChild(li);
        });
    },

    togglePlay() {
        if (this.songs.length === 0) {
            alert('Please select some music files first.');
            return;
        }

        if (this.isPlaying) {
            this.audioElement.pause();
            this.elements.playBtn.textContent = '▶️';
        } else {
            this.audioElement.play();
            this.elements.playBtn.textContent = '⏸️';
        }
        this.isPlaying = !this.isPlaying;
    },

    playTrack(index) {
        if (index < 0) index = this.songs.length - 1;
        if (index >= this.songs.length) index = 0;

        this.currentTrack = index;
        this.audioElement.src = this.songs[index].url;
        this.elements.songTitle.textContent = this.songs[index].name;
        this.elements.songArtist.textContent = this.songs[index].artist;
        
        // Update playlist active state
        const playlistItems = this.elements.playlist.querySelectorAll('li');
        playlistItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        this.audioElement.play()
            .then(() => {
                this.isPlaying = true;
                this.elements.playBtn.textContent = '⏸️';
            })
            .catch(error => {
                console.error('Error playing audio:', error);
                alert('Error playing this track. Please try another.');
            });
    },

    playNext() {
        this.playTrack(this.currentTrack + 1);
    },

    playPrevious() {
        this.playTrack(this.currentTrack - 1);
    },

    updateProgress() {
        if (!isNaN(this.audioElement.duration)) {
            const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
            this.elements.progressBar.value = progress;
        }
    },

    seek(value) {
        const time = (value / 100) * this.audioElement.duration;
        if (!isNaN(time)) {
            this.audioElement.currentTime = time;
        }
    },

    setVolume(value) {
        const volume = value / 100;
        this.audioElement.volume = volume;
        this.elements.volumeBar.value = value;
    },

    async scanDirectory(dirHandle) {
        const audioFiles = [];
        
        async function* getFilesRecursively(handle) {
            for await (const entry of handle.values()) {
                if (entry.kind === 'file') {
                    if (entry.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
                        audioFiles.push(await entry.getFile());
                    }
                } else if (entry.kind === 'directory') {
                    yield* getFilesRecursively(entry);
                }
            }
        }

        try {
            for await (const _ of getFilesRecursively(dirHandle)) {
                // Files are collected in audioFiles array
            }

            if (audioFiles.length === 0) {
                alert('No audio files found in the selected directory.');
                return;
            }

            this.loadFiles(audioFiles);
        } catch (err) {
            console.error('Error scanning directory:', err);
            alert('Error scanning directory. Please try again.');
        }
    },
};

document.addEventListener('DOMContentLoaded', () => {
    musicPlayer.init();
});