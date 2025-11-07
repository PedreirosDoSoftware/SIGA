<?php
session_start();
require 'auth_functions.php';

// Geração de token CSRF
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$erro = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verificação do token CSRF
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        $erro = "Requisição inválida!";
    } else {
        // Sanitização básica
        $nome = trim(filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING));
        $email = trim(filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL));
        $senha = $_POST['senha'];
        $confirmarSenha = $_POST['confirmarSenha'];
        $tipo = $_POST['tipo'];

        $tiposValidos = ['aluno', 'professor', 'admin'];
        if (!$email) {
            $erro = "Email inválido.";
        } elseif (!in_array($tipo, $tiposValidos)) {
            $erro = "Tipo de usuário inválido.";
        } elseif (strlen($senha) < 6) {
            $erro = "A senha deve ter no mínimo 6 caracteres.";
        } elseif ($senha !== $confirmarSenha) {
            $erro = "As senhas não coincidem.";
        } else {
            if (cadastrarUsuario($nome, $email, $senha, $tipo)) {
                unset($_SESSION['csrf_token']); // Redefine após sucesso
                header("Location: login.php?cadastro=sucesso");
                exit;
            } else {
                $erro = "Erro ao cadastrar! Email já em uso.";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIGA - Cadastro</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="cadastro.css">
</head>
<body>
    <div class="container">
        <div class="logo">
            <i class="fas fa-graduation-cap"></i>
            <h1>SIGA</h1>
            <p>Sistema Inteligente de Gestão Acadêmica</p>
        </div>

        <?php if (!empty($erro)): ?>
            <div style="color: red; margin-bottom: 10px;">
                <?= htmlspecialchars($erro) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="cadastro.php">
            <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">

            <div class="form-group">
                <label for="nome">Nome Completo</label>
                <input type="text" id="nome" name="nome" required>
            </div>

            <div class="form-group">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" required>
            </div>

            <div class="form-group">
                <label for="senha">Senha</label>
                <input type="password" id="senha" name="senha" required minlength="6">
            </div>

            <div class="form-group">
                <label for="confirmarSenha">Confirmar Senha</label>
                <input type="password" id="confirmarSenha" name="confirmarSenha" required minlength="6">
            </div>

            <div class="form-group">
                <label for="tipo">Tipo de usuário</label>
                <select id="tipo" name="tipo" required>
                    <option value="aluno">Aluno</option>
                    <option value="professor">Professor</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>

            <button type="submit" class="btn-primary">Cadastrar</button>

            <div class="login-link">
                Já possui uma conta? <a href="login.php">Faça login</a>
            </div>
        </form>
    </div>
</body>
</html>
