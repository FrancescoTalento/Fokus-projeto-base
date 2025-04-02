const btnAddTarefa = document.querySelector(".app__button--add-task");

// coisas do form
const formAddTarefa = document.querySelector(".app__form-add-task");
const formCancelarTarefa = document.querySelector("button.app__form-footer__button--cancel");
const textArea = document.querySelector(".app__form-textarea");


const containerUlTarefas = document.querySelector(".app__section-task-list");
const paragrafoTarefaAtiva = document.querySelector(".app__section-active-task-description"); 

// tarefa e seu li
let tarefaSelecionada = null
let liTarefaSelecinada = null


//butoes de limapr tarefas
let btnRemoveTarefaConcluida = document.querySelector("#btn-remover-concluidas");
let btnRemoveTodasTarefas = document.querySelector("#btn-remover-todas");

// pegando as tarefas ja existentes ou n
let tarefasListJson = JSON.parse(localStorage.getItem("tarefas")) || [];
//mostrando ja essas tarefas na Ul
converteMostrarTarefasUl(tarefasListJson)



// eventos
btnAddTarefa.addEventListener("click", showHideFormAddTarefa);

formAddTarefa.addEventListener("submit", (event)=>{
    event.preventDefault()
    const tarefaItemJson = {
        descricao: textArea.value,
    }; // cria a tarefa JSON
    salvarJsonTarefa(tarefaItemJson); // cria e salva o JSON tarefa no localStorage
    converteMostrarTarefasUl(tarefasListJson)
    
    textArea.value = ""; // tira o texto da texArea
    showHideFormAddTarefa()
})
formAddTarefa.addEventListener("keydown", (event)=>{
    if(event.key === "Enter"){
        event.preventDefault()
        const tarefaItemJson = {
            descricao: textArea.value,
        }; // cria a tarefa JSON
        salvarJsonTarefa(tarefaItemJson); // cria e salva o JSON tarefa no localStorage
        converteMostrarTarefasUl(tarefasListJson)
    
        limpaFormulario() // esconde o formulario e limpa a textArea
    }
});
formCancelarTarefa.onclick = () => {
    console.log("clicado");
};


document.addEventListener("FocoFinalizado", () => {
  //  "app__section-task-list-item-complete"
  if (liTarefaSelecinada && tarefaSelecionada) {
    //alterando a classe para o complete
    liTarefaSelecinada.classList.remove("app__section-task-list-item-active");
    liTarefaSelecinada.classList.add("app__section-task-list-item-complete");

    //desabilitadno o button e o li(temporariamente o li)
    liTarefaSelecinada.querySelector("button").disabled = "disabled";
    liTarefaSelecinada.style.pointerEvents = "none";
    //sinalizando que a tarefa foi completa e atualizando a localStorage
    tarefaSelecionada.completa = true;
    atualizaTarefaJson(tarefaSelecionada);

    // limpando o paragrafo tarefa ativa
    paragrafoTarefaAtiva.textContent = "";

    //tirando o eventListener de li
  }
});
const removeTarefas = (apenasCompletas) =>{
    // pegando ou so as completas ou todas
    const seletor = apenasCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";

    //removendo visualmente
    containerUlTarefas.querySelectorAll(seletor).forEach((tarefa)=>{
        tarefa.remove();
    })
    //removendo na localStorage
    tarefasListJson = apenasCompletas ? tarefasListJson.filter(tarefa => tarefa.completa !== true) : []
    localStorage.setItem("tarefas", JSON.stringify(tarefasListJson))
}

btnRemoveTarefaConcluida.onclick = () =>{
    removeTarefas(true)
}
btnRemoveTodasTarefas.onclick = () =>{
    removeTarefas(false)
}

// funcoes

function limpaFormulario(){
    formAddTarefa.classList.add("hidden")
    textArea.value = "";
}

function showHideFormAddTarefa() {
    formAddTarefa.classList.toggle("hidden");
}

function converteMostrarTarefasUl(arrayTarefaJson){
    containerUlTarefas.innerHTML = ""
    arrayTarefaJson.forEach((tarefaJson)=>{
        const li = criarLiTarefa(tarefaJson)
        containerUlTarefas.append(li);
    })
}
function criarLiTarefa(tarefaJson){
    //cria o item da listaTarefas (ul)
    const li = document.createElement("li");
    li.classList.add("app__section-task-list-item");


        // PROCESSO DE CRIACAO DA TAREFA
    // o svg de check de tarefa concluida eh criado
    const svg = document.createElement("svg");
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
                <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
        `;
    li.append(svg); //add ele ao li

    // crio o p que ira conter a descricao da tarefa
    const paragrafo = document.createElement("p");
    paragrafo.classList.add("app__section-task-list-item-description");
    paragrafo.textContent = `${tarefaJson.descricao}`;
    li.append(paragrafo); // add ele ao li

    //crio o btn edita para editar o conteudo da tarefa
    const btnEdita = document.createElement("button");
    btnEdita.classList.add("app_button-edit");

    //a imagem que ira ser mostrada como o butao
    const imagemBtn = document.createElement("img");
    imagemBtn.src = "imagens/edit.png";
    btnEdita.append(imagemBtn); // add a img ao butao

    li.append(btnEdita); // add o btn ao li
    let estado = {edicaoFinalizada: false};
        //EVENT LISTENERS DA TAREFA
        btnEdita.onclick = () =>{
            
            const taEditando = li.querySelector("input")
            if(taEditando){
                estado.edicaoFinalizada = true;
                taEditando.remove()
                li.insertBefore(paragrafo, btnEdita)
                paragrafo.textContent = tarefaJson.descricao
                
                return;
            }
            //cria o input
            estado.edicaoFinalizada = false
            const inputEdita = criaInputEditaTarefa(tarefaJson, paragrafo,estado);
            setTimeout(() => {
            inputEdita.focus();
            }, 0);
            paragrafo.replaceWith(inputEdita);
        }
    if(tarefaJson.completa){
        li.classList.add(
          "app__section-task-list-item-complete" // colocando o estilo certo
        );
        li.style.pointerEvents = "auto";
        
        //desabilitadno o button
        btnEdita.disabled = "disabled"; 
    }else{
        li.onclick = () =>{
            containerUlTarefas.querySelectorAll("li").forEach((tarefa)=>{
                tarefa.classList.remove("app__section-task-list-item-active");
            })
            if(tarefaSelecionada === tarefaJson){
                paragrafoTarefaAtiva.textContent = ""
                tarefaSelecionada = null
                liTarefaSelecinada = null
                return
            }
    
            liTarefaSelecinada = li
            tarefaSelecionada = tarefaJson
            paragrafoTarefaAtiva.textContent = tarefaJson.descricao
            li.classList.add("app__section-task-list-item-active");
            //"app__section-task-list-item-active"
        }
    }
    return li;
}
function criaInputEditaTarefa(tarefaJson, paragrafo,estadoEdicao) {
    const inputEdit = document.createElement("input");
    inputEdit.type = "text";
    inputEdit.classList.add("app__section-task-list-item-description");
    inputEdit.value = paragrafo.textContent;

    const textoOriginal = paragrafo.textContent;

    // Função de blur separada (para poder remover depois)
    function blurHandler() {
      setTimeout(() => {
        if (!estadoEdicao.edicaoFinalizada) {
          confirmaEdicao(inputEdit, paragrafo, tarefaJson, textoOriginal);
        }
      }, 0); // Executa depois do clique
    }

    inputEdit.addEventListener("blur", blurHandler);

    inputEdit.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            inputEdit.removeEventListener("blur", blurHandler); // Impede o blur de sobrescrever
            cancelaEdicao(inputEdit, paragrafo, textoOriginal);
        } else if (event.key === "Enter") {
            inputEdit.removeEventListener("blur", blurHandler); // Impede o blur de sobrescrever
            confirmaEdicao(inputEdit, paragrafo, tarefaJson, textoOriginal);
        }
    });

    return inputEdit;
}

function cancelaEdicao(inputEdit, paragrafo, textoOriginal) {
    paragrafo.textContent = textoOriginal;
    inputEdit.replaceWith(paragrafo);
}

function confirmaEdicao(inputEdit, paragrafo, tarefaJson,textoOriginal) {
    //console.log(textoOriginal)
    if(inputEdit.value === ""){
        cancelaEdicao(inputEdit, paragrafo, textoOriginal)  
        window.alert("Tarefa nao pode ser vazia")      
        return
        
    }else{
         paragrafo.textContent = inputEdit.value;
        inputEdit.replaceWith(paragrafo); // atualiza o visual
    
        tarefaJson.descricao = paragrafo.textContent
        atualizaTarefaJson(tarefaJson); // atualiza o localStorage
    }
   
    
}




function atualizaTarefaJson(tarefaJson) {
    const index = tarefasListJson.findIndex((tarefa) => tarefa === tarefaJson)
    if (index !== -1) {
        tarefasListJson[index] = tarefaJson;
        localStorage.setItem("tarefas",JSON.stringify(tarefasListJson))
    }
}

function salvarJsonTarefa(tarefaItemJson) {
    const tarefaExiste = tarefasListJson.some((tarefa) => tarefa.descricao === tarefaItemJson.descricao)
    if(tarefaExiste){
        console.log("Nao pode tarefa repetida")
        return
    }
    tarefasListJson.push(tarefaItemJson); // add a list de tarefas JSON
    localStorage.setItem("tarefas", JSON.stringify(tarefasListJson)); // salva as tarefas no localStorage

}
