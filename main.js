document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('total-alunos').textContent = '120';
    document.getElementById('total-turmas').textContent = '8';
    document.getElementById('total-pendencias').textContent = '5';

    const alunos = [
        { nome: 'João Silva', turma: 'Turma A', status: 'alert' },
        { nome: 'Maria Souza', turma: 'Turma B', status: 'alert' },
        { nome: 'Carlos Oliveira', turma: 'Turma C', status: 'alert' },
        { nome: 'Ana Santos', turma: 'Turma A', status: 'alert' },
        { nome: 'Pedro Costa', turma: 'Turma B', status: 'alert' },
        { nome: 'Luiza Pereira', turma: 'Turma D', status: 'alert' },
        { nome: 'Marcos Rocha', turma: 'Turma C', status: 'alert' },
        { nome: 'Fernanda Lima', turma: 'Turma E', status: 'alert' },
        { nome: 'Ricardo Alves', turma: 'Turma B', status: 'alert' },
        { nome: 'Juliana Castro', turma: 'Turma A', status: 'alert' }
    ];

    const tabela = document.querySelector('#tabela-alunos tbody');
    alunos.forEach(aluno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.turma}</td>
            <td><span class="status ${aluno.status}"><i class="fas fa-exclamation-triangle"></i> Alerta</span></td>
        `;
        tabela.appendChild(row);
    });
});
