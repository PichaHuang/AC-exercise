// DEFAULT CODE ////////////////////////
const BASE_URL = 'https://lyric-api-403c0.firebaseio.com/'
const songList = document.querySelector('#song-list')
const lyricsPanel = document.querySelector('#lyrics-panel')
const album = {
  artist: 'Adele',
  album: '25',
  tracks: [
    'Hello',
    'Send My Love (To Your New Lover)',
    'I Miss You',
    'When We Were Young',
    'Remedy',
    'Water Under the Bridge',
    'River Lea',
    'Love in the Dark',
    'Million Years Ago',
    'All I Ask',
    'Sweetest Devotion'
  ]
}

// WRITE YOUR CODE ////////////////////////
//遍歷曲目並顯示出來
let lists = ``
for (let track of album.tracks) {
  lists += `
  <li class="nav-item">
    <a class="nav-link" href="#">${track}</a>
  </li>
  `
}
songList.innerHTML = lists

//設監聽器
songList.addEventListener("click", function (event) {
  //1.刪除已存在的反藍標籤
  const activeLabel = document.querySelector('#song-list .active')
  if (activeLabel) {
    activeLabel.classList.remove('active')
  }
  //2.點擊的曲目反藍 
  event.target.classList.add('active')
  //3.抓對應的歌詞
  const singer = album.artist
  const trackName = event.target.innerText
  axios
    .get(`${BASE_URL}/${singer}/${trackName}.json`)
    .then((response) => {
      const trackLyrics = response.data.lyrics
      lyricsPanel.innerHTML = `
      <h4>${trackName}</h4>
      <pre>${trackLyrics}</pre>
      `
    })
    .catch((error) => console.log(error))
})