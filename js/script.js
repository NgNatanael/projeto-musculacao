// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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
    document.querySelectorAll("section").forEach(secao => secao.classList.remove("ativo"));
    document.getElementById(secaoId).classList.add("ativo");
}

// Salva o treino no Firestore
async function salvarTreino() {
    const treino = {
        data: document.getElementById("data-treino").value,
        exercicio: document.getElementById("exercicio").value,
        peso: document.getElementById("peso").value,
        repeticoes: document.getElementById("repeticoes").value
    };
    try {
        await addDoc(collection(db, "treinos"), treino);
        console.log("Treino salvo com sucesso!");
        listarTreinos();
    } catch (error) {
        console.error("Erro ao salvar treino: ", error);
    }
}

// Salva a evolução no Firestore
async function salvarEvolucao() {
    const evolucao = {
        pesoCorporal: document.getElementById("peso-corporal").value,
        observacao: document.getElementById("observacao").value
    };
    try {
        await addDoc(collection(db, "evolucao"), evolucao);
        console.log("Evolução salva com sucesso!");
        listarEvolucoes();
    } catch (error) {
        console.error("Erro ao salvar evolução: ", error);
    }
}

// Listar treino do dia
async function listarTreinoDoDia() {
    const hoje = new Date().toISOString().split('T')[0];
    const treinoDoDiaContainer = document.getElementById("treino-do-dia");
    treinoDoDiaContainer.innerHTML = `<h3>Treino para: ${hoje}</h3>`;
    
    const q = query(collection(db, "treinos"), where("data", "==", hoje));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
            const treino = doc.data();
            treinoDoDiaContainer.innerHTML += `<p>${treino.exercicio} - ${treino.peso}kg - ${treino.repeticoes} repetições</p>`;
        });
    } else {
        treinoDoDiaContainer.innerHTML += `<p>Nenhum treino registrado para hoje.</p>`;
    }
}

// Listar todos os treinos e evoluções
async function listarTreinos() {
    const listaTreino = document.getElementById("lista-treino");
    listaTreino.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "treinos"));
    querySnapshot.forEach(doc => {
        const treino = doc.data();
        listaTreino.innerHTML += `<p>${treino.data} - ${treino.exercicio} - ${treino.peso}kg - ${treino.repeticoes} repetições</p>`;
    });
}

async function listarEvolucoes() {
    const listaEvolucao = document.getElementById("lista-evolucao");
    listaEvolucao.innerHTML = "";
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
    event.target.reset();
});

document.getElementById("form-evolucao").addEventListener("submit", (event) => {
    event.preventDefault();
    salvarEvolucao();
    event.target.reset();
});

// Carregar dados ao iniciar e mostrar o treino do dia
window.addEventListener("load", () => {
    listarTreinos();
    listarEvolucoes();
    listarTreinoDoDia();
});
