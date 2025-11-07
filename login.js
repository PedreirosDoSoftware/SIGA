document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('senha');
    const rememberCheckbox = document.getElementById('remember');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();

        let isValid = true;

        const email = document.getElementById('email');
        if (!validateEmail(email.value)) {
            showError(email, 'Por favor, insira um e-mail válido');
            isValid = false;
        }

        const senha = document.getElementById('senha');
        if (senha.value.length < 6) {
            showError(senha, 'A senha deve ter pelo menos 6 caracteres');
            isValid = false;
        }

        if (isValid) {
            simulateLogin({
                email: email.value,
                senha: senha.value,
                remember: rememberCheckbox ? rememberCheckbox.checked : false
            });
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');

        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }

    function clearErrors() {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        });
    }

    function simulateLogin(credentials) {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Autenticando...';
        submitBtn.disabled = true;

        // Simulação de autenticação
        setTimeout(() => {
            // Redirecionamento corrigido
            window.location.href = 'tela-inicial.html';
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }
});
