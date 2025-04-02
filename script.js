//html element
const html = document.querySelector("html")

// elementos do temporizador
const containerTimer = document.getElementById("timer");
const btnPausePlayTimer = document.getElementById("start-pause");


// btn do temporizador e afins
let tempoArmazenado = 1500
let cicliFinalizado = false
let tempoDeTemporizador = tempoArmazenado;
let intervalo = null; //variaveis de controle de timer

const playAudio = new Audio("sons/play.wav");
const pauseAudio = new Audio("sons/pause.mp3"); 
const fimTemporizadorAudio = new Audio("sons/beep.mp3"); // variaveis de audio

//musica e afins
const musica = new Audio("sons/luna-rise-part.mp3"); 
musica.loop = true;
musica.volume = 1;
const btnPlayPauseMusic = document.querySelector(".toggle-checkbox"); 


// getting the buttons
const butoes = document.querySelectorAll("button.app__card-button");

const btnFoco = document.querySelector(".app__card-button--foco");

const btnCurto = document.querySelector(".app__card-button--curto");

const btnLongo = document.querySelector(".app__card-button--longo");


// section banner elements
const h1Text = document.querySelector(".app__title");
const imgFigure = document.querySelector(".app__image");

// usando musica
btnPlayPauseMusic.addEventListener("change", (event)=>{
    musica.paused ? musica.play() : musica.pause();
})

mostrarTemp();
//temporizador controles
btnPausePlayTimer.addEventListener("click", iniciarOuPausar)

function mostrarTemp(){
    const tempo = new Date(tempoDeTemporizador*1000);
    const tempoFormatado = tempo.toLocaleString("pt-br", {
        minute: "2-digit",
        second: "2-digit"
    })
    containerTimer.innerText = tempoFormatado
}

function reduzirTempo(){
    if(tempoDeTemporizador <= 0){
        let dataContexto = html.dataset.contexto
        if(dataContexto === "foco"){
            const evento = new CustomEvent("FocoFinalizado");
            document.dispatchEvent(evento)
        }
        
        indicaFimTimer();
        setDefaultSettingsTimer();
        return
    }
    tempoDeTemporizador-=1;
    mostrarTemp();
}

function indicaFimTimer() {
    fimTemporizadorAudio.play();

    cicliFinalizado = true;
    alert("Tempo Finalizado");
}

function setDefaultSettingsTimer() {
    zerar();
    tempoDeTemporizador = tempoArmazenado;
  
    mostrarTemp();
}

function zerar() {
    clearInterval(intervalo); // pausa o intercalo
    intervalo = null; // seta o intervalo como pausado
    alteraBtnTimer(); // altera btn
}

function iniciarOuPausar(){ 
    //se estiver pausado, de play
    cicliFinalizado = false;
    if(intervalo === null){
      playAudio.play(); // toca audio e executa funcao
      intervalo = setInterval(reduzirTempo, 1000);

      alteraBtnTimer(); // altera btn
    }
    
    else{// se estiver play, de pause
        pauseAudio.play(); // toca audio
        zerar()
    }
    
            
}

function alteraBtnTimer(){
    if(intervalo === null || cicliFinalizado === true){ // se pausado faca
        btnPausePlayTimer.innerHTML = `<img class="app__card-primary-butto-icon" src="../imagens/play_arrow.png" alt=""> 
        <span>Começar</span>`;
    }else if(intervalo || cicliFinalizado === false){ // se playing faca
        btnPausePlayTimer.innerHTML = `<img class="app__card-primary-butto-icon" src="../imagens/pause.png" alt="">           
        <span>Pausar</span>`;
    }
}


// escolhendo contexto
butoes.forEach((button)=>{
    console.log(button)
    
    button.addEventListener("click",(event)=>{
        h1Text.innerHTML = ""; 
        butoes.forEach((btn) => btn.classList.remove("active"))
        
        if (event.target === btnFoco) {
            alterContext("foco");
            btnFoco.classList.add("active");
        
        } else if (event.target === btnCurto) {
            alterContext("descanso-curto");
            btnCurto.classList.add("active");
        
        }else if(event.target === btnLongo){
            alterContext("descanso-longo");
            btnLongo.classList.add("active");
        }
    })
})

function alterContext(contexto){
    imgFigure.src = `imagens/${contexto}.png`;
    html.setAttribute("data-contexto", contexto);

    switch (contexto) {
        case "foco":
            tempoArmazenado = 1500;
            h1Text.innerHTML = `Otimize sua produtividade,<br> <strong class="app__title-strong">mergulhe no que importa. </strong>`;
            break;
        case "descanso-curto":
            tempoArmazenado = 300;
            h1Text.innerHTML = `Que tal dar uma respirada?<br>      <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            break
        case"descanso-longo":
            tempoArmazenado = 900;
            h1Text.innerHTML = `Hora de voltar à superfície.<br> <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            break
        default:
            break;
    }
    tempoDeTemporizador = tempoArmazenado
    mostrarTemp();
    zerar()
}
