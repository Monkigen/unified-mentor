class Player {
    constructor() {
        this.audio = new Audio();
        this.currentTrackIndex = 0;
        this.playlist = [];
    }

    loadTrack(track) {
        this.audio.src = track;
        this.audio.load();
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    next() {
        this.currentTrackIndex++;
        if (this.currentTrackIndex >= this.playlist.length) {
            this.currentTrackIndex = 0;
        }
        this.loadTrack(this.playlist[this.currentTrackIndex]);
        this.play();
    }

    previous() {
        this.currentTrackIndex--;
        if (this.currentTrackIndex < 0) {
            this.currentTrackIndex = this.playlist.length - 1;
        }
        this.loadTrack(this.playlist[this.currentTrackIndex]);
        this.play();
    }

    setPlaylist(tracks) {
        this.playlist = tracks;
        this.loadTrack(this.playlist[this.currentTrackIndex]);
    }
}

export default Player;