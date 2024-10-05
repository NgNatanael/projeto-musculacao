// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAWevtkjUECk9he94FX4o8Wg8kh8pGRGgk",
    authDomain: "projeto-musculacao.firebaseapp.com",
    projectId: "projeto-musculacao",
    storageBucket: "projeto-musculacao.appspot.com",
    messagingSenderId: "1027024998979",
    appId: "1:1027024998979:web:033ea83e199ed58d4e3af6",
    measurementId: "G-PCXHZL7650"
};

// Inicializa Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function mostrarSecao(secaoId) {
    // Ocultar todas as seções e exibir apenas a selecionada
    document.querySelectorAll("section").forEach(secao => secao.classList.remove("ativo"));
    document.getElementById(secaoId).classList.add("ativo");
}

// Função para salvar treino no Firestore
async function salvarTreino() {
    const treino = {
        data: document.getElementById("data-treino").value,
        exercicio: document.getElementById("exercicio").value,
        peso: document.getElementById("peso").value
    };
    try {
        await addDoc(collection(db, "treinos"), treino);
        console.log("Treino salvo com sucesso!");
        listarTreinos(); // Atualiza a lista de treinos
    } catch (error) {
        console.error("Erro ao salvar treino: ", error);
    }
}

// Função para salvar evolução no Firestore
async function salvarEvolucao() {
    const evolucao = {
        pesoCorporal: document.getElementById("peso-corporal").value,
        observacao: document.getElementById("observacao").value
    };
    try {
        await addDoc(collection(db, "evolucao"), evolucao);
        console.log("Evolução salva com sucesso!");
        listarEvolucoes(); // Atualiza a lista de evoluções
    } catch (error) {
        console.error("Erro ao salvar evolução: ", error);
    }
}

// Função para listar treinos
async function listarTreinos() {
    const listaTreino = document.getElementById("lista-treino");
    listaTreino.innerHTML = ""; // Limpa a lista
    const querySnapshot = await getDocs(collection(db, "treinos"));
    querySnapshot.forEach(doc => {
        const treino = doc.data();
        listaTreino.innerHTML += `<p>${treino.data} - ${treino.exercicio} - ${treino.peso}kg</p>`;
    });
}

// Função para listar evoluções
async function listarEvolucoes() {
    const listaEvolucao = document.getElementById("lista-evolucao");
    listaEvolucao.innerHTML = ""; // Limpa a lista
    const querySnapshot = await getDocs(collection(db, "evolucao"));
    querySnapshot.forEach(doc => {
        const evolucao = doc.data();
        listaEvolucao.innerHTML += `<p>${evolucao.pesoCorporal}kg - ${evolucao.observacao}</p>`;
    });
}

// Event listeners para submissão dos formulários
document.getElementById("form-treino").addEventListener("submit", (event) => {
    event.preventDefault();
    salvarTreino();
    event.target.reset(); // Limpa o formulário após o envio
});

document.getElementById("form-evolucao").addEventListener("submit", (event) => {
    event.preventDefault();
    salvarEvolucao();
    event.target.reset(); // Limpa o formulário após o envio
});

// Carregar dados ao iniciar
window.addEventListener("load", () => {
    listarTreinos();
    listarEvolucoes();
});
