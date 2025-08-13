document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
               
        clearErrors();
        
        if (!validateNome()) return;
        if (!validateEmail()) return;
        if (!validateSenha()) return;
        if (!validateConfirmacaoSenha()) return;
        
        
        alert('Cadastro realizado com sucesso!');
        
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    });
    
    function validateNome() {
        const nomeInput = document.getElementById('nome');
        if (nomeInput.value.trim() === '') {
            showError(nomeInput, 'Por favor, insira seu nome completo');
            return false;
        }
        return true;
    }
    
    function validateEmail() {
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Por favor, insira seu e-mail');
            return false;
        }
        
        if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Por favor, insira um e-mail válido');
            return false;
        }
        
        return true;
    }
    
    function validateSenha() {
        const senhaInput = document.getElementById('senha');
        if (senhaInput.value.length < 6) {
            showError(senhaInput, 'A senha deve ter pelo menos 6 caracteres');
            return false;
        }
        return true;
    }
    
    function validateConfirmacaoSenha() {
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        
        if (confirmarSenha !== senha) {
            showError(document.getElementById('confirmarSenha'), 'As senhas não coincidem');
            return false;
        }
        
        return true;
    }
    
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        
        const errorMessage = formGroup.querySelector('.error-message') || document.createElement('small');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorMessage);
        }
    }
    
    function clearErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(error => {
            error.classList.remove('error');
        });
        
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }
});
