document.getElementById('form-login').addEventListener('submit', function (e) {
    e.preventDefault();

    const matricula = document.getElementById('matricula').value;
    const senha = document.getElementById('senha').value;

    // Simulação de autenticação (ajuste conforme o seu backend ou estrutura local)
    const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    const aluno = alunos.find(a => a.matricula === matricula && a.senha === senha);

    if (aluno) {
        alert('Login bem-sucedido!');
        window.location.href = 'painel-aluno.html'; // Redireciona para painel do aluno
    } else {
        alert('Matrícula ou senha incorretos.');
    }
});
