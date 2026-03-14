const songs = [
  {title:"Besuch vom Lande", author:"Erich Kästner", src:"https://www.deutschelyrik.de/files/Gedichte/besuch_vom_lande.mp3", textFile:"text_m1.txt", category:"Mine", loop:true},
  {title:"Augen in der Großstadt", author:"Kurt Tucholsky", src:"https://www.deutschelyrik.de/files/Gedichte/augen%20_in_der_grossstadt.mp3", textFile:"text_m2.txt", category:"Mine", loop:true},
  {title:"Der Gott der Stadt", author:"Georg Heym", src:"https://www.deutschelyrik.de/files/Gedichte/der_gott_der_stadt.mp3", textFile:"text_m3.txt", category:"Mine", loop:true},
  {title:"Großstadt", author:"Wolfgang Borchert", src:"https://www.deutschelyrik.de/files/Gedichte/grossstadt.mp3", textFile:"text_m4.txt", category:"Mine", loop:true},
  {title:"Großstadt - Weihnachten", author:"Kurt Tucholsky", src:"https://www.deutschelyrik.de/files/Gedichte/grossstadt_weihnachten.mp3", textFile:"text_m5.txt", category:"Mine", loop:true},
  {title:"Augen in der Großstadt", author:"Kurt Tucholsky", src:"https://www.deutschelyrik.de/files/Gedichte/augen%20_in_der_grossstadt.mp3", textFile:"text_m6.txt", category:"Mine", loop:true},
  {title:"Der rechte Weg", author:"Franz Werfel", src:"https://www.deutschelyrik.de/files/Gedichte/der_rechte_weg.mp3", textFile:"text_s1.txt", category:"School", loop:true},
  {title:"In einer großen Stadt", author:"Detlev von Liliencron", src:"https://www.deutschelyrik.de/files/Gedichte/in_einer_grossen_stadt.mp3", textFile:"text_s2.txt", category:"School", loop:true}
];

const interpretation = [
  {src:"interpretation_m1.mp3", textFile:"interpretation_m1.txt"},
  {src:"interpretation_m2.mp3", textFile:"interpretation_m2.txt"},
  {src:"interpretation_m3.mp3", textFile:"interpretation_m3.txt"},
  {src:"interpretation_m4.mp3", textFile:"interpretation_m4.txt"},
  {src:"interpretation_m5.mp3", textFile:"interpretation_m5.txt"},
  {src:"interpretation_m6.mp3", textFile:"interpretation_m6.txt"},
  {src:"interpretation_m1.mp3", textFile:"interpretation_s1.txt"},
  {src:"interpretation_m2.mp3", textFile:"interpretation_s2.txt"}
];

// --- Main Player Variables ---
let index = 0;
let loop = false;
let popWindow = null;

// --- Interpretation Player Variables ---
let popWindow2 = null;

// --- Elements ---
const audio = document.getElementById("audio");
const play = document.getElementById("play");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const loopBtn = document.getElementById("loop");
const progress = document.getElementById("progress");
const title = document.getElementById("title");
const author = document.getElementById("author");
const playlist = document.getElementById("playlist");
const nextTrackText = document.getElementById("nextTrack");
const textContent = document.getElementById("textContent");
const popoutBtn = document.getElementById("popout");

const audio2 = document.getElementById("audio2");
const play2 = document.getElementById("play2");
const prev2 = document.getElementById("prev2");
const next2 = document.getElementById("next2");
const loopBtn2 = document.getElementById("loop2");
const progress2 = document.getElementById("progress2");
const title2 = document.getElementById("title2");
const author2 = document.getElementById("author2");
const textContent2 = document.getElementById("textContent2");
const popoutBtn2 = document.getElementById("popout2");

// --- Build Playlist ---
function buildPlaylist(){
  playlist.innerHTML="";
  const categories = [...new Set(songs.map(s=>s.category))];
  categories.forEach(cat=>{
    const catContainer = document.createElement("div");
    catContainer.className="category-container";

    const catDiv = document.createElement("div");
    catDiv.className="category";

    const catCheckbox = document.createElement("input");
    catCheckbox.type="checkbox";
    catCheckbox.checked = songs.filter(s=>s.category===cat).every(s=>s.loop);

    const catLabel = document.createElement("span");
    catLabel.textContent=cat;

    catDiv.appendChild(catLabel);
    catDiv.appendChild(catCheckbox);
    catContainer.appendChild(catDiv);

    const catTracksContainer = document.createElement("div");
    catTracksContainer.className="category-tracks";
    catTracksContainer.style.display="block";

    catDiv.onclick = (e)=>{
      if(e.target.tagName.toLowerCase()==="input") return;
      catTracksContainer.style.display = catTracksContainer.style.display==="none"?"block":"none";
    };

    catCheckbox.onchange = ()=>{
      const catSongs = songs.filter(s=>s.category===cat);
      const totalChecked = songs.filter(s=>s.loop).length;
      if(!catCheckbox.checked && totalChecked===catSongs.length){ catCheckbox.checked=true; return; }
      catSongs.forEach(s=>{
        const div = document.querySelector(`.track[data-index='${songs.indexOf(s)}']`);
        if(!catCheckbox.checked && totalChecked>1){ s.loop=false; if(div) div.classList.add("skipped"); if(index===songs.indexOf(s)){ const nextSong = songs.find(t=>t.loop); if(nextSong){ index = songs.indexOf(nextSong); loadSong(); audio.play(); play.textContent="⏸"; } else{ audio.pause(); play.textContent="▶"; } } }
        else { s.loop=true; if(div) div.classList.remove("skipped"); }
        if(div) div.querySelector("input[type=checkbox]").checked=s.loop;
      });
    };

    songs.filter(s=>s.category===cat).forEach((song,i)=>{
      const div = document.createElement("div");
      div.className="track";
      div.dataset.index = songs.indexOf(song);
      div.dataset.category = cat;
      div.innerHTML = `${i+1}. ${song.title}`;

      const checkbox = document.createElement("input");
      checkbox.type="checkbox";
      checkbox.checked=song.loop;
      checkbox.onchange = ()=>{
        const checkedCount = songs.filter(s=>s.loop).length;
        if(!checkbox.checked && checkedCount===1){ checkbox.checked=true; return; }
        song.loop = checkbox.checked;
        div.classList.toggle("skipped",!song.loop);
        if(index===songs.indexOf(song) && !song.loop){
          const nextSong = songs.find(s=>s.loop);
          if(nextSong){ index = songs.indexOf(nextSong); loadSong(); audio.play(); play.textContent="⏸"; } else{ audio.pause(); play.textContent="▶"; }
        }
        const catSongs = songs.filter(s=>s.category===song.category);
        const catCheckbox = div.parentNode.previousSibling.querySelector("input[type=checkbox]");
        if(catCheckbox) catCheckbox.checked = catSongs.every(s=>s.loop);
      };

      div.appendChild(checkbox);
      div.onclick = ()=>{
        index = songs.indexOf(song);
        loadSong();
        audio.play();
        play.textContent="⏸";
      };

      catTracksContainer.appendChild(div);
    });

    catContainer.appendChild(catTracksContainer);
    playlist.appendChild(catContainer);

    new Sortable(catTracksContainer,{animation:150,onEnd(evt){
      const catName = evt.to.parentNode.querySelector(".category span").textContent;
      const newOrder=[];
      Array.from(evt.to.children).forEach(el=>{ if(el.classList.contains("track")) newOrder.push(songs[parseInt(el.dataset.index)]); });
      let i=0;
      for(let j=0;j<songs.length;j++){ if(songs[j].category===catName) songs[j]=newOrder[i++]; }
      buildPlaylist();
    }});
  });
}

// --- Update Playlist Highlight ---
function updatePlaylist(){ document.querySelectorAll(".track").forEach((el,i)=>{ el.classList.toggle("active",i===index); }); }
function updateNextTrack(){ const checkedSongs=songs.filter(s=>s.loop); if(checkedSongs.length===0){ nextTrackText.textContent="Next Track: None"; return; } let nextSong=checkedSongs.find(s=>songs.indexOf(s)>index); if(!nextSong) nextSong=checkedSongs[0]; nextTrackText.textContent="Next Track: "+nextSong.title; }

// --- Load Main Song ---
async function loadSong(){
  const song = songs[index];
  audio.src = song.src;
  title.textContent="Title: "+song.title;
  author.textContent="Subtitle: "+song.author;

  // Sync interpretation player to main track
  loadInterpretation();

  try{
    const resp = await fetch(song.textFile);
    if(resp.ok){
      let text = await resp.text();
      text = text.split("\n").map((line,i)=>line.trim()!==""?`<span class="verse-number">${i+1}</span>${line}`:"").join("\n");
      textContent.innerHTML=text;
    } else textContent.textContent="Text not found. Run via local server.";
  } catch(e){ textContent.textContent="Error loading text. Run via local server."; }

  updatePlaylist();
  updateNextTrack();
  if(popWindow && !popWindow.closed) updatePopWindow();
}

// --- Load Interpretation Song ---
async function loadInterpretation(){
  const song = interpretation[index];
  audio2.src = interpretation[index].src; // separate audio
  title2.textContent="Interprätation";
  author2.textContent="";

  try{
    const resp = await fetch(song.textFile);
    if(resp.ok){
      let text = await resp.text();
      text = text.split("\n").map(line=>line.trim()).join("\n"); // remove verse numbers
      textContent2.textContent=text;
    } else textContent2.textContent="Text not found. Run via local server.";
  } catch(e){ textContent2.textContent="Error loading text. Run via local server."; }
}

// --- Main Controls ---
play.onclick = ()=>{ if(audio.paused){ audio.play(); play.textContent="⏸"; } else { audio.pause(); play.textContent="▶"; }};
prev.onclick = ()=>{ do{ index--; if(index<0) index=songs.length-1; }while(!songs[index].loop); loadSong(); audio.play(); play.textContent="⏸"; };
next.onclick = ()=>{ do{ index++; if(index>=songs.length) index=0; }while(!songs[index].loop); loadSong(); audio.play(); play.textContent="⏸"; };
loopBtn.onclick = ()=>{ loop=!loop; loopBtn.classList.toggle("active",loop); };
audio.ontimeupdate = ()=>{ progress.value=(audio.currentTime/audio.duration)*100; };
progress.oninput = ()=>{ audio.currentTime=(progress.value/100)*audio.duration; };
audio.onended = ()=>{ if(loop){ const checked=songs.filter(s=>s.loop); if(checked.length===0) return; let nextSong=checked.find(s=>songs.indexOf(s)>index); if(!nextSong) nextSong=checked[0]; index=songs.indexOf(nextSong); loadSong(); audio.play(); } else next.click(); };
audio.onpause = ()=>{ play.textContent="▶"; };
audio.onplay = ()=>{ play.textContent="⏸"; };

// --- Interpretation Controls ---
play2.onclick = ()=>{ if(audio2.paused){ audio2.play(); play2.textContent="⏸"; } else { audio2.pause(); play2.textContent="▶"; }};
prev2.onclick = ()=>{ index--; if(index<0) index=songs.length-1; loadSong(); audio2.play(); play2.textContent="⏸"; };
next2.onclick = ()=>{ index++; if(index>=songs.length) index=0; loadSong(); audio2.play(); play2.textContent="⏸"; };
loopBtn2.onclick = ()=>{ loop2=!loop2; loopBtn2.classList.toggle("active",loop2); };
audio2.ontimeupdate = ()=>{ progress2.value=(audio2.currentTime/audio2.duration)*100; };
progress2.oninput = ()=>{ audio2.currentTime=(progress2.value/100)*audio2.duration; };

// --- Pop-out buttons ---
popoutBtn.onclick = ()=>{
  if(!popWindow || popWindow.closed){ openPopWindow(); popoutBtn.textContent="↙"; } 
  else { popWindow.close(); popoutBtn.textContent="↗"; }
};
popoutBtn2.onclick = ()=>{
  if(!popWindow2 || popWindow2.closed){ openPopWindow2(); popoutBtn2.textContent="↙"; } 
  else { popWindow2.close(); popoutBtn2.textContent="↗"; }
};

// --- Initialize ---
buildPlaylist();
loadSong();
