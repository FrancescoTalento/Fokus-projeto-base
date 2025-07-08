interface Tarefa {
    descricao:string,
    concluida:boolean
}

interface EstadoAplicacao {
    tarefas: Tarefa[],
    tarefaSelecionada:Tarefa | null,
    editando:boolean
}



let estadoInicial:EstadoAplicacao = {
    tarefas: [
    { 
        descricao: 'Tarefa concluída',
        concluida: true
    },
    {
        descricao: 'Tarefa pendente 1',
        concluida: false
    },
    {
        descricao: 'Tarefa pendente 2',
        concluida: false
    }
    ],

    tarefaSelecionada: null,
    editando: false
}


const selecionarTarefa = (estado:EstadoAplicacao, tarefa:Tarefa) : EstadoAplicacao =>{
    return{
        ...estado,
        tarefaSelecionada: tarefa === estado.tarefaSelecionada ? null : tarefa
    }
}
const adicionarTarefa = (estado: EstadoAplicacao, tarefa:Tarefa) :EstadoAplicacao =>{
    return{
        ...estado,
        tarefas: [...estado.tarefas, tarefa]
    }
}

const deletar = (estado: EstadoAplicacao) : EstadoAplicacao =>{
    if(estado.tarefaSelecionada){
        const tarefasNovas = estado.tarefas.filter(t => t != estado.tarefaSelecionada)
        return {
            ...estado,
            editando: false,
            tarefaSelecionada: null,
            tarefas: tarefasNovas
        }
    }
    return estado
}

const deletarTodas = (estado: EstadoAplicacao):EstadoAplicacao =>{
    return{
        ...estado,
        tarefas: [],
        tarefaSelecionada: null,
        editando: false
    }
}

const deletarConcluidas = (estado:EstadoAplicacao):EstadoAplicacao =>{
    return{
        ...estado,
        tarefas: estado.tarefas.filter(t => !t.concluida),
        tarefaSelecionada: null,
        editando: false
    }
}

const editarTarefa = (estado: EstadoAplicacao, tarefa: Tarefa): EstadoAplicacao =>{
    return{
        ...estado,
        editando: !estado.editando,
        tarefaSelecionada: tarefa
    }
}

const salvarEdicao = (estado: EstadoAplicacao, descricaoNova:string):EstadoAplicacao=>{
    const novasTarefas = estado.tarefas.map((tarefa) => {
        if(tarefa == estado.tarefaSelecionada){
             return {
                ...tarefa,
                descricao: descricaoNova
            };
        }
        return tarefa;
    })
    return{
        ...estado,
        tarefas:novasTarefas,
        tarefaSelecionada:null,
        editando:false
    }
}


const atualizarUI = () =>{
    const taskIconSvg = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF" />
            <path
                d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E" />
        </svg>
        `
    const formTask = document.querySelector<HTMLFormElement>('form.app__form-add-task')
    const toggleFormTaskBtn = document.querySelector<HTMLButtonElement>('.app__button--add-task')
    const ulTarefas = document.querySelector<HTMLUListElement>('.app__section-task-list');
    const taskAtiveDescription = document.querySelector('.app__section-active-task-description')
    const textarea = document.querySelector<HTMLTextAreaElement>('.app__form-textarea')
    const btnCancelar = document.querySelector<HTMLButtonElement>('.app__form-footer__button--cancel')
    const btnDeletar = document.querySelector<HTMLButtonElement>('.app__form-footer__button--delete')

    const btnDeletarConcluidas = document.querySelector<HTMLButtonElement>('#btn-remover-concluidas')
    const btnDeletarTodas = document.querySelector<HTMLButtonElement>('#btn-remover-todas')
    
    taskAtiveDescription!.textContent = estadoInicial.tarefaSelecionada ? estadoInicial.tarefaSelecionada.descricao : null

    if(estadoInicial.editando && estadoInicial.tarefaSelecionada){
        formTask?.classList.remove('hidden');
        textarea!.value = estadoInicial.tarefaSelecionada.descricao;
    }
    
    toggleFormTaskBtn!.onclick = (event) =>{
        formTask?.classList.toggle('hidden')
    }

    formTask!.onsubmit = (event) => {
    event.preventDefault();
    const descricao = textarea!.value;

    if (estadoInicial.editando && estadoInicial.tarefaSelecionada) {
        // Modo edição
        estadoInicial = salvarEdicao(estadoInicial, descricao);
    } else {
        // Modo criação
        estadoInicial = adicionarTarefa(estadoInicial, {
            descricao,
            concluida: false
        });
    }

    atualizarUI();
    formTask?.reset();
    toggleFormTaskBtn?.click();
}

    btnCancelar!.onclick = ()=>{
        formTask?.reset()
        formTask?.classList.add('hidden')
    }

    btnDeletar!.onclick = ()=>{
        estadoInicial = deletar(estadoInicial)
        formTask?.classList.add('hidden')
        atualizarUI()
    }
    btnDeletarConcluidas!.onclick = ()=>{
        estadoInicial = deletarConcluidas(estadoInicial)
        atualizarUI()
    }
    btnDeletarTodas!.onclick = ()=>{
        estadoInicial = deletarTodas(estadoInicial)
        atualizarUI()
    }

    if(ulTarefas){
        ulTarefas.innerHTML = "";
    }
    
    estadoInicial.tarefas.forEach((tarefa) => {
      
        const li = document.createElement('li')
        li.classList.add('app__section-task-list-item')

        const svgIcon = document.createElement('svg')
        svgIcon.innerHTML = taskIconSvg

        const paragraph = document.createElement('p')
        paragraph.classList.add('app__section-task-list-item-description')
        paragraph.textContent = tarefa.descricao

        const button = document.createElement('button')
        button.classList.add('app_button-edit')

        const editIcon = document.createElement('img')
        editIcon.setAttribute('src', '/imagens/edit.png')

        button.appendChild(editIcon)

        if (tarefa.concluida) {
            button.setAttribute('disabled', 'true')
            li.classList.add('app__section-task-list-item-complete')
        }
        if (tarefa == estadoInicial.tarefaSelecionada) {
        li.classList.add('app__section-task-list-item-active')
        }
    

        li.appendChild(svgIcon)
        li.appendChild(paragraph)
        li.appendChild(button)

        li.onclick= (event) =>{
            event.stopPropagation();
            estadoInicial = selecionarTarefa(estadoInicial, tarefa)
            atualizarUI()
        }

        button.onclick = (evento) => {
            evento.stopPropagation();
            estadoInicial = editarTarefa(estadoInicial, tarefa);
            atualizarUI();
        }


        ulTarefas?.appendChild(li)
    });
}

document.addEventListener('TarefaFinalizada', (event) => {
    if(estadoInicial.tarefaSelecionada){
        estadoInicial.tarefaSelecionada.concluida = true;
        atualizarUI();
    }
});


atualizarUI();