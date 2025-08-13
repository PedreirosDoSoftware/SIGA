document.getElementById('form-login').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const docente = {
        email,
        senha
    };

    // Salvando localmente (simula backend)
    localStorage.setItem('docente', JSON.stringify(docente));
    alert('Login realizado com sucesso!');
    window.location.href = 'login-docente.html';
})
