import { v4 as uuidv4 } from "uuid";

// simulação de banco para teste
const eventosBancoMock = [
    {
        id: "d3b07384-d113-424a-a764-585a2100824e",
        titulo: "Caminhada Ecológica PARNASO",
        descricao: "Trilha guiada com observação da fauna e flora local.",
        local: "Parque Nacional da Serra dos Órgãos",
        tema: "Eco-Turismo",
        data_horario: "2026-10-20T09:00:00.000Z",
        limite_pessoas: 15,
        created_at: new Date().toISOString()
    }
];

export async function criarEventoService(dados) {
    const novoEvento = {
        id: uuidv4(),
        titulo: dados.titulo,
        descricao: dados.descricao || null,
        local: dados.local,
        tema: dados.tema,
        data_horario: dados.data_horario,
        limite_pessoas: dados.limite_pessoas,
        created_at: new Date().toISOString()
    };

    eventosBancoMock.push(novoEvento);
    return novoEvento;
}

export async function listarEventosService() {
    return eventosBancoMock;
}

export async function buscarEventoService(id) {
    return eventosBancoMock.find(e => e.id === id) || null;
}

export async function atualizarEventoService(id, dados) {
    const index = eventosBancoMock.findIndex(e => e.id === id);
    if (index === -1) return null;

    eventosBancoMock[index] = {
        ...eventosBancoMock[index],
        titulo: dados.titulo ?? eventosBancoMock[index].titulo,
        descricao: dados.descricao ?? eventosBancoMock[index].descricao,
        local: dados.local ?? eventosBancoMock[index].local,
        tema: dados.tema ?? eventosBancoMock[index].tema,
        data_horario: dados.data_horario ?? eventosBancoMock[index].data_horario,
        limite_pessoas: dados.limite_pessoas ?? eventosBancoMock[index].limite_pessoas
    };

    return eventosBancoMock[index];
}

export async function excluirEventoService(id) {
    const index = eventosBancoMock.findIndex(e => e.id === id);
    if (index === -1) return null;

    const [eventoRemovido] = eventosBancoMock.splice(index, 1);
    return eventoRemovido;
}