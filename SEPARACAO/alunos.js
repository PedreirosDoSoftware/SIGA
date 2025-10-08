document.addEventListener('DOMContentLoaded', function() {
    // Recupera alunos do localStorage ou cria array vazio
    let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    
    // Elementos da interface
    const tabelaAlunos = document.getElementById('tabela-alunos');
    const totalAlunosElement = document.getElementById('total-alunos');
    const alunosAtivosElement = document.getElementById('alunos-ativos');
    const mediaGeralElement = document.getElementById('media-geral');
    
    // Função para calcular a média de um aluno
    function calcularMedia(nota1, nota2, nota3) {
        return (parseFloat(nota1) + parseFloat(nota2) + parseFloat(nota3)) / 3;
    }
    
    // Função para atualizar a interface
    function atualizarInterface() {
        // Limpa a tabela
        tabelaAlunos.innerHTML = '';
        
        // Variáveis para cálculos
        let totalAtivos = 0;
        let somaMedias = 0;
        
        // Preenche a tabela com alunos
        alunos.forEach(aluno => {
            const media = aluno.media;
            const status = media >= 6 ? 'active' : 'inactive';
            const statusText = media >= 6 ? 'Ativo' : 'Inativo';
            
            if(media >= 6) totalAtivos++;
            somaMedias += media;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${aluno.matricula}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.turma}</td>
                <td>${aluno.nota1}</td>
                <td>${aluno.nota2}</td>
                <td>${aluno.nota3}</td>
                <td>${media.toFixed(1)}</td>
                <td><span class="status ${status}">${statusText}</span></td>
                <td>
                    <button class="action-btn edit" onclick="editarAluno('${aluno.matricula}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="removerAluno('${aluno.matricula}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tabelaAlunos.appendChild(row);
        });
        
        // Atualiza os cards
        totalAlunosElement.textContent = alunos.length;
        alunosAtivosElement.textContent = totalAtivos;
        mediaGeralElement.textContent = alunos.length > 0 ? (somaMedias / alunos.length).toFixed(1) : '0.0';
    }
    
    // Função para adicionar um novo aluno
    window.adicionarAluno = function(novoAluno) {
        const media = calcularMedia(novoAluno.nota1, novoAluno.nota2, novoAluno.nota3);
        
        alunos.push({
            matricula: novoAluno.matricula,
            nome: novoAluno.nome,
            turma: novoAluno.turma,
            nota1: novoAluno.nota1,
            nota2: novoAluno.nota2,
            nota3: novoAluno.nota3,
            media: media
        });
        
        localStorage.setItem('alunos', JSON.stringify(alunos));
        atualizarInterface();
    }
    
    // Função para remover um aluno
    window.removerAluno = function(matricula) {
        if(confirm('Tem certeza que deseja remover este aluno?')) {
            alunos = alunos.filter(a => a.matricula !== matricula);
            localStorage.setItem('alunos', JSON.stringify(alunos));
            atualizarInterface();
        }
    }
    
    // Função para editar um aluno (esboço)
    window.editarAluno = function(matricula) {
        alert('Funcionalidade de edição será implementada em breve');
        console.log('Editar aluno:', matricula);
    }
    
    // Inicializa a interface
    atualizarInterface();
});
