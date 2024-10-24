// Variáveis globais*************************************************
//VARIAVEIS **********************
var numPaginas;
var numInteracoes;
var totalErros=0;
//variavei guarda em qual página das requisições ja estamos 
var quantRequiFeitas=0;
//ARRAYS
var vetpaginas = new Array(numPaginas);
var vetRequisicoes = new Array(numInteracoes);
var vetMemoriaMain = new Array(3);

//get divs para manipulação ********
const divMemoriaMain = document.querySelector("#memoriaMain");
const divDisco = document.querySelector("#disco");
const divRequisicoes = document.querySelector("#sequenciaRequisicoes");
const divBtnRequisitaPag = document.querySelector("#RequisitaPagina");
const diverros = document.querySelector("#erros");

// CONSTRUINDO TABELA PARA MOSTRAR A MEMORIA PRINCIPAL
const tableMemoriaMain = document.createElement("table");
tableMemoriaMain.className = 'tabelas';
const trMemoriaMain = document.createElement("tr");

// Criando os slots*********************
const slot1 = document.createElement("th");
slot1.textContent = "Slot 1";
const slot2 = document.createElement("th");
slot2.textContent = "Slot 2";
const slot3 = document.createElement("th");
slot3.textContent = "Slot 3";

// Adicionando slots à linha*********
trMemoriaMain.append(slot1);
trMemoriaMain.append(slot2);
trMemoriaMain.append(slot3);
tableMemoriaMain.append(trMemoriaMain);
divMemoriaMain.appendChild(tableMemoriaMain);

// Função que captura a quantidade de páginas e interações
function geraRequisicoes() {
    numInteracoes = document.querySelector('#numInteracoes').value;
    numPaginas = document.querySelector('#numPaginas').value;

    alert(`Numero de páginas criadas: ${numPaginas}\nNumero de interações: ${numInteracoes}`);

    // Populando o array de páginas
    for (let i = 0; i < numPaginas; i++) {
        vetpaginas[i] = i;
    }
    
    //populando array de como serão feitas as requisições
    for (let i = 0; i < numInteracoes; i++) {
        let paginaRequisitada = Math.floor(Math.random() * numPaginas);
        if (paginaRequisitada >= 0) {
            vetRequisicoes[i] = paginaRequisitada;
        }
    }

    printaDisco();
    printaTabelaRequisicoes();

    //requisiçoes prontas e disco criado agora é utlizar o fifo para genrencias os acessos;
    const btnRequisitaPagina = document.createElement("button");
    btnRequisitaPagina.id = 'btnRequisitaPagina';
    btnRequisitaPagina.textContent="Requisitar nova página";
    divBtnRequisitaPag.appendChild(btnRequisitaPagina);
     
    btnGeraSeq.remove();
}

function gerenciadorFifo(){
    

    let paginaRequisitada = vetRequisicoes[quantRequiFeitas];
    let valorRecuperado = vetMemoriaMain[2];
    // Verifica se a página já está na memória
    if (vetMemoriaMain.includes(paginaRequisitada)) {
        
        // Não aumenta totalErros se a página já está na memória
    } else {
        // Página não está na memória, então é um erro (page fault)
        totalErros= totalErros+1;
       
        // Se a memória estiver cheia, substitua a página mais antiga (FIFO)
        if (vetMemoriaMain[0] !== null) {
            vetMemoriaMain[2] = vetMemoriaMain[1];
            vetMemoriaMain[1] = vetMemoriaMain[0];
        }

        // Adiciona a nova página na primeira posição
        vetMemoriaMain[0] = paginaRequisitada;
        let valorExcluirtabela = vetMemoriaMain[0];
        
        vetpaginas[valorExcluirtabela]= null;
        vetpaginas[valorRecuperado]= valorRecuperado;
        
    }

    // Atualiza a tabela com a nova configuração da memória
    criaTabelaMain(vetMemoriaMain);
    printaDisco();
    quantRequiFeitas++;

    if(quantRequiFeitas==numInteracoes){
        divBtnRequisitaPag.remove();
    }
    
}

function criaTabelaMain(arraySlots) {
    // Verifica se o array tem exatamente 3 posições
    if (arraySlots.length !== 3) {
        console.error("O array precisa ter exatamente 3 elementos.");
        return;
    }

    // Criando nova linha para os dados
    const trDados = document.createElement("tr");

    // Adicionando os valores do array aos slots
    const tdslot1Info = document.createElement("td");
    tdslot1Info.textContent = arraySlots[0];

    const tdslot2Info = document.createElement("td");
    tdslot2Info.textContent = arraySlots[1];

    const tdslot3Info = document.createElement("td");
    tdslot3Info.textContent = arraySlots[2];

    // Adicionando os dados à linha
    trDados.append(tdslot1Info);
    trDados.append(tdslot2Info);
    trDados.append(tdslot3Info);

    // Adicionando a linha à tabela principal
    tableMemoriaMain.append(trDados);
}


// Função alterada para recriar a tabela do disco
function printaDisco() {
    // Limpar o conteúdo da divDisco e criar uma nova tabela
    divDisco.innerHTML = '';

    let titulo =  document.createElement("h1");
    titulo.textContent="Disco";
    divDisco.appendChild(titulo);


    // Criar uma nova tabela
    const tableDisco = document.createElement("table");
    const erros = document.createElement("h4");
    const taxaErros = document.createElement("h4");
    tableDisco.className = 'tabelas';
    tableDisco.id = 'tabeladisco';

    erros.textContent= `Total de erros: ${totalErros}`;
    taxaErros.textContent=`Taixa de erros: ${totalErros/numInteracoes}`;

    // Criar uma nova linha de dados
    const trDadosDisco = document.createElement("tr");

    for (let i = 0; i < vetpaginas.length; i++) {
        // Adicionar cada página aos slots
        const tdslotDisco = document.createElement("td");
        tdslotDisco.textContent = vetpaginas[i]; // Mostra o valor correto do array
        trDadosDisco.append(tdslotDisco);
    }

    // Adicionar a linha à nova tabela
    tableDisco.append(trDadosDisco);

    // Adicionar a nova tabela ao div
    divDisco.appendChild(tableDisco);
    divDisco.appendChild(erros);
    divDisco.appendChild(taxaErros);

}

function printaTabelaRequisicoes() {
    // 
    

    // Criar uma nova tabela
    const tableRequisicao = document.createElement("table");
    tableRequisicao.className = 'tabelas';
    tableRequisicao.id = 'tabelaRequisicao';

    // Criar uma nova linha de dados
    const trRequisicao = document.createElement("tr");

    for (let i = 0; i < vetRequisicoes.length; i++) {
        // Adicionar cada página aos slots
        const tdRequisicao = document.createElement("td");
        tdRequisicao.textContent = vetRequisicoes[i]; // Mostra o valor correto do array
        trRequisicao.append(tdRequisicao);
    }

    // Adicionar a linha à nova tabela
    tableRequisicao.append(trRequisicao);

    // Adicionar a nova tabela ao div
    divRequisicoes.appendChild(tableRequisicao);
}

// BOTÕES
const btnGeraSeq = document.querySelector("#btnGeraSequencia");
btnGeraSeq.addEventListener('click', function () {
    geraRequisicoes();
});

divBtnRequisitaPag.addEventListener('click', function(){
    gerenciadorFifo();
})