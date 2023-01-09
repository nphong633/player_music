const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const cd = $('.cd')
const heading = $('header h2')
const audio = $('#audio')
const cdThumb = $('.cd-thumb')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

// 1.render songs
// 2.scroll top
// 3.play/pause/seek
// 4.CD rotate 
// 5.next/pre
// 6.random
// 7.next/repeat when ended
// 8.active song
// 9.scroll active song into view :kéo active song lên tầm nhìn
// 10.play song when click


const app = {
    currentIndex : 1,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
      {
        name: "Như anh đã thấy em",
        singer: "PhúcXP",
        path: "../assets/music/song1.mp3",
        image: "../assets/image/img1.jpg"
      },
      {
        name: "Be the one",
        singer: "PANDORA",
        path: "../assets/music/song2.mp3",
        image: "../assets/image/img2.jpg"
      },
      {
        name: "Hình như ta thích nhau",
        singer: "Doãn Hiếu",
        path: "../assets/music/song3.mp3",
        image: "../assets/image/img3.jpg"
      },
      {
        name: "Unity",
        singer: "The Fatrat",
        path: "../assets/music/song4.mp3",
        image: "../assets/image/img4.jpg"
      },
      {
        name: "Người em Cố Đô",
        singer: "Rum x Đaa",
        path: "../assets/music/song5.mp3",
        image: "../assets/image/img5.jpg"
      },
      {
        name: "Đào nương",
        singer: "Hoàng Vương x Thành Acoustic x Liam Lofi",
        path: "../assets/music/song6.mp3",
        image: "../assets/image/img6.jpg"
      },
      {
        name: "Đi về nhà",
        singer: "Đen x JustaTee",
        path: "../assets/music/song7.mp3",
        image: "../assets/image/img7.jpg"
      },{
        name: "Tát nước đầu đình",
        singer: "Lynk Lee ft.Binz",
        path: "../assets/music/song8.mp3",
        image: "../assets/image/img8.jpg"
      },
      {
        name: "Ái nộ",
        singer: "Masew x Khoi Vu",
        path: "../assets/music/song9.mp3",
        image: "../assets/image/img9.jpg"
      },
      {
        name: "Mặt mộc",
        singer: "Phạm Nguyên Ngọc x VAnh x Ân Nhi (Original)",
        path: "../assets/music/song10.mp3",
        image: "../assets/image/img10.jpg"
      },
    ],
    defineProperties: function() {
      Object.defineProperty(this,'currentSong', {
        get:function() {
          return this.songs[this.currentIndex]
        }
      })
    },
    render: function() {
      const htmls = this.songs.map(function(song, index) {
        return `
        <div class="song ${index === app.currentIndex ? 'active' : ''}"data-index =${index}>
            <div class="thumb" 
              style="background-image: url('${song.image}">
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
      })
      playList.innerHTML = htmls.join('')
    },
    //Hàm next bài hát
    nextSong: function() {
      this.currentIndex++
      if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0
      }
      this.loadCurrentSong()
    },
    //Hàm pre bài hát
    preSong: function() {
      this.currentIndex--
      if(this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
      }
      this.loadCurrentSong()
    },
    playRandomSong: function() {
      let newIndex 
      do {
        newIndex = Math.floor(Math.random() * this.songs.length)
      }
      while(newIndex === this.currentIndex)
      this.currentIndex = newIndex
      this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
      const _this = this
      setTimeout(function() {
        if(_this.currentIndex > 4) { 
          $('.song.active').scrollIntoView({
            behavior:'smooth',
            block:'nearest'
          })
        }else {
          $('.song.active').scrollIntoView({
            behavior:'smooth',
            block:'center'
          })
        }
      },100)
    },
    // Xử lí các sự kiện
    handleEvent: function() {
      const _this = this
      const cdWidth = cd.offsetWidth

      //Xử lí CD quay
      const cdThumbAnimate = cdThumb.animate([
        {transform:'rotate(360deg)'}
      ], {
        duration: 10000,
        iterations:Infinity
      })
      cdThumbAnimate.pause()

      // Xử lí phóng to thu nhỏ document CD
      document.onscroll = function() {
        const cdScrollWidth = window.scrollY || document.documentElement.scrollTop
        const cdNewWidth = cdWidth - cdScrollWidth

        cd.style.width = cdNewWidth > 0 ? cdNewWidth + 'px' : 0
        cd.style.opacity = cdNewWidth / cdWidth
      }

      //Xử lí khi click play
      playBtn.onclick = function() {
        if(_this.isPlaying) {
          audio.pause()
        } else {
          audio.play()
        }
      }
      // Khi song được play 
      audio.onplay = function() {
        _this.isPlaying = true      //thay giá trị của biến
        player.classList.add('playing')     //thay icon dừng
        cdThumbAnimate.play()   //đĩa CD quay
      }
      // Khi song bị pause
      audio.onpause = function() {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      }
      //Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function() {
        if(audio.duration) {
          const progressPercent = Math.floor(audio.currentTime/audio.duration*100)
          progress.value = progressPercent
        }
      }
      //Xử lí khi tua song 
      progress.oninput = function(e) {
        const seekTime = e.target.value*audio.duration/100
        audio.currentTime = seekTime
        }

      //Xử lí khi next song
      nextBtn.onclick = function() {
        if(_this.isRandom) {
          _this.playRandomSong()
        }
        else {
          _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      //Xử lí khi pre song
      preBtn.onclick = function() {
        if(_this.isRandom) {
          _this.playRandomSong()
        }else {
          _this.preSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      //Xử lí khi bật tắt random song
      randomBtn.onclick = function(e) {
        _this.isRandom = !_this.isRandom
        _this.isRepeat = false
        repeatBtn.classList.remove('active')
        randomBtn.classList.toggle('active')
      }

      //Xử lí lặp lại một song
      repeatBtn.onclick = function() {
        _this.isRepeat = !_this.repeatBtn
        _this.isRandom = false
        randomBtn.classList.remove('active')
        repeatBtn.classList.toggle('active')
      }

      //Xử lí next song khi audio end
      audio.onended = function() {
        if(_this.isRepeat) {
          audio.play()
        }else {
          nextBtn.click()
        }
      }
      //Xử lí khi click vào song
      playList.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active)')
        const songOption = e.target.closest('.option')
        if(songNode || songOption) {
          //Xử lí khi muốn chuyển bài hát
          if(songNode && !songOption) {
            _this.currentIndex = Number(songNode.dataset.index)
            _this.loadCurrentSong()
            _this.render()
            audio.play()
          }
        }
      }
    },
    //Hàm tải thông tin bài hát
    loadCurrentSong: function() {
      heading.textContent = this.currentSong.name
      audio.src = this.currentSong.path
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    },
    start: function() {
      // Định nghĩa các thuộc tính trong object
      this.defineProperties()
      // lắng nghe/ xử lí các sự kiện(DOM event)
      this.handleEvent()
      // tải thông tin bài hát đầu tiên vào UI khi chạy vào ứng dụng
      this.loadCurrentSong()
      // render các playlist
      this.render()
    }
}

app.start()
