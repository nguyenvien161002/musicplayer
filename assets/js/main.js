const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $('.playlist');
const heading = $('header h2');
const cdThumd = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player')
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const PLAY_STORAGE_KEY = 'F8_PLAYER';

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAY_STORAGE_KEY)) || {},
    songs: [
        {
          name: "Monster",
          singer: "LUM!X x Gabry Ponte",
          path: "./assets/music/Monster - LUM!X x Gabry Ponte.mp3",
          image: "./assets/images/imgMonster.jfif"
        },
        {
            name: "Nevada",
            singer: "Cozi Zuehlsdorff",
            path: "./assets/music/Nevada - Cozi Zuehlsdorff.mp3",
            image: "./assets/images/imgNevada.jpg"
        },
        {
            name: "Thunder",
            singer: "Gabry Ponte x LUM!X x Prezioso",
            path: "./assets/music/Thunder - Gabry Ponte x LUM!X x Prezioso.mp3",
            image: "./assets/images/imgThunder.jpg"
        },    
        {
            name: "Attention",
            singer: "Charlie Puth",
            path: "./assets/music/Attention - Charlie Puth.mp3",
            image: "./assets/images/imgAttention.jpg"
        },
        {
            name: "Monody",
            singer: "Laura Brehm",
            path: "./assets/music/Monody - Laura Brehm.mp3",
            image: "./assets/images/imgMonody1.jfif"
        },
        {
            name: "Reality",
            singer: "Lost Frequencies",
            path: "./assets/music/Reality - Lost Frequencies.mp3",
            image: "./assets/images/imgReatity.jfif"
        },
        {
            name: "Send It",
            singer: "Austin Mahone",
            path: "./assets/music/Send It - Austin Mahone.mp3",
            image: "./assets/images/imgSendIt.jfif"
        },
        {
            name: "Way Back Home",
            singer: "SHAUN",
            path: "./assets/music/WayBackHome - SHAUN.mp3",
            image: "./assets/images/imgWayBackHome.jpg"
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAY_STORAGE_KEY, JSON.stringify(this.config))
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })        
    },
    render: function() {
        const html = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = html.join('');
    },
    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // X??? l?? CD quay khi b??i hay play/ d???ng khi pause
        const cdThumbAnimate = cdThumd.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        })

        cdThumbAnimate.pause();

        // X??? l?? ph??ng to thu nh??? CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0; 
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // X??? l?? click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        // Khi song ???????c play th?? l???ng nghe s??? ki???n play v?? g??n nh?? b??n ???????i
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }      

        // Khi song b??? pause th?? l???ng nghe s??? ki???n pause v?? g??n nh?? b??n ???????i
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi ti???n ????? b??i h??t thay ?????i
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // X??? l?? khi tua
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Chuy???n b??i h??t
        nextBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        prevBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Random b??i h??t
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // X??? l?? repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        },

        // X??? l?? next song khi audio end
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // X??? l?? khi click v??o b??i h??t n??o th?? b??i ???? play
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)') 
            if(songNode || e.target.closest('.option')){
                // X??? l?? khi ???n v??o song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // X??? l?? khi ???n v??o song option
                if(e.target.closest('.option')) {
                    console.log(e.target);
                }
            }
        }

    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumd.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    }
    ,
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth", 
                block: "center", 
            });
        }, 300)
    },
    start: function() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();
