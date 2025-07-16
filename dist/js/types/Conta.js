import { TipoTransacao } from "./TipoTransacao.js";
let saldo = JSON.parse(localStorage.getItem("saldo")) || 0;
//Cria ou busca as transações já realizadas. 
//Retorna a data da transação como um objeto Date.
const transacoes = JSON.parse(localStorage.getItem("transacoes"), (key, value) => {
    if (key === "data") {
        return new Date(value);
    }
    return value;
}) || [];
function debitar(valor) {
    if (valor <= 0) {
        throw new Error("O valor a ser debitado deve ser maior que 0");
    }
    if (valor > saldo) {
        throw new Error("Saldo insuficiente");
    }
    saldo -= valor;
    localStorage.setItem("saldo", saldo.toString());
}
function depositar(valor) {
    if (valor <= 0) {
        throw new Error("O valor a ser depositado deve ser maior que 0");
    }
    saldo += valor;
    localStorage.setItem("saldo", saldo.toString());
}
const Conta = {
    getSaldo() {
        return saldo;
    },
    getDataAcesso() {
        return new Date();
    },
    getGruposTransacoes() {
        const gruposTransacoes = [];
        //Cria uma cópia do objeto e gera uma nova referência.
        //As modificações que forem feitas na cópia não atingem o objeto original.
        const listaTransacoes = structuredClone(transacoes);
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });
            if (labelAtualGrupoTransacao != labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            //Vai ao final do array e insere a transacao
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }
        return gruposTransacoes;
    },
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error("Transação inválida");
        }
        transacoes.push(novaTransacao);
        console.log(this.getGruposTransacoes());
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    }
};
// type ResumoTransacoes = {
//     totalDepositos: number;
//     totalTransferencias: number;
//     totalPagamentosBoleto: number;
// }
// agruparTransacoes(): ResumoTransacoes {
//     const resumo: ResumoTransacoes = { 
//         totalDepositos: 0, 
//         totalTransferencias: 0, 
//         totalPagamentosBoleto: 0 
//     };
//     this.transacoes.forEach(transacao => {
//         switch (transacao.tipoTransacao) {
//             case TipoTransacao.DEPOSITO:
//                 resumo.totalDepositos += transacao.valor;
//                 break;
//             case TipoTransacao.TRANSFERENCIA:
//                 resumo.totalTransferencias += transacao.valor;
//                 break;
//             case TipoTransacao.PAGAMENTO_BOLETO:
//                 resumo.totalPagamentosBoleto += transacao.valor;
//                 break;
//         }
//     });
//     return resumo;
// }
export default Conta;
