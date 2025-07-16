import { Transacao } from "../types/Transacao.js";
import { TipoTransacao } from "../types/TipoTransacao.js";
import SaldoComponent from "./saldo-component.js";
import Conta from "../types/Conta.js";
import ExtratoComponent from "./extrato-component.js";

const elementoFormulario = document.querySelector(".block-nova-transacao form") as HTMLFormElement;
elementoFormulario.addEventListener("submit", function(event) {
    try {
        event.preventDefault();

        //No HTML tem o atributo novalidate e required para confirmar se todos os campos foram preenchidos.
        //Então a função checkValidity verifica se todos os campos foram preenchidos.
        if(!elementoFormulario.checkValidity()) {
            alert("Por favor, preencha todos os campos da transação");
            return;
        }

        const inputTipoTransacao = elementoFormulario.querySelector("#tipoTransacao") as HTMLSelectElement;
        const inputValor = elementoFormulario.querySelector("#valor") as HTMLInputElement;
        const inputData = elementoFormulario.querySelector("#data") as HTMLInputElement;

        //O valor recebido do tipo da transação será convertido para se adequar ao TipoTransação já definido na Enum.
        //O value do inputTipoTransação vai ser comparado com um dos elementos do TipoTransação.
        let tipoTransacao: TipoTransacao = inputTipoTransacao.value as TipoTransacao;
        let valor: number = inputValor.valueAsNumber;
        //" 00:00:00" ajusta um erro padrão do Date
        let data: Date = new Date(inputData.value + " 00:00:00");
        
        //Cria um objeto com os valores da transação
        const novaTransacao: Transacao = {
            tipoTransacao: tipoTransacao,
            valor: valor,
            data: data
        }

        Conta.registrarTransacao(novaTransacao);
        SaldoComponent.atualizar();
        ExtratoComponent.atualizar();
        elementoFormulario.reset();
    }

    catch(erro) {
        alert(erro.message);
    }    
});
