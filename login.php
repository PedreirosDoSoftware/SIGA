<?php
require 'auth_functions.php';

$erro = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $senha = $_POST['senha'];
    
    if (fazerLogin($email, $senha)) {
        header("Location: tela-inicial.php");
        exit;
    } else {
        $erro = "Email ou senha incorretos!";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>SIGA - Login</title>
    <link rel="stylesheet" href="login.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <div class="logo-header">
            <i class="fas fa-graduation-cap logo-icon"></i>
            <div>
                <h1>SIGA</h1>
                <p>Sistema Inteligente de Gestão Acadêmica</p>
            </div>
        </div>

        <?php if (!empty($erro)): ?>
            <p class="error-message" style="color: red;"><?= htmlspecialchars($erro) ?></p>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label for="email"><i class="fas fa-envelope"></i> E-mail</label>
                <input type="email" id="email" name="email" placeholder="Digite seu e-mail" required>
            </div>
            <div class="form-group">
                <label for="senha"><i class="fas fa-lock"></i> Senha</label>
                <div class="password-container">
                    <input type="password" id="senha" name="senha" placeholder="Digite sua senha" required>
                </div>
            </div>
            <div class="form-options">
                
                <a id="es" href="#" class="esqueci-minha-senha">Esqueci minha senha</a>
            </div>
            <button type="submit" class="btn-primary">
                <i class="fas fa-sign-in-alt"></i> Entrar
            </button>
            <div class="register-link">
                Não possui uma conta? <a href="cadastro.php">Cadastre-se aqui</a>
            </div>
        </form>
    </div>
</body>
</html>
