<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require 'database.php';

function cadastrarUsuario($nome, $email, $senha, $tipo = 'aluno') {
    global $pdo;

    // Verifica se o e-mail já está cadastrado
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        return false; // Email já em uso
    }

    // Cadastra novo usuário
    $stmt = $pdo->prepare("INSERT INTO usuarios (nome_completo, email, senha, tipo) VALUES (?, ?, ?, ?)");
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
    return $stmt->execute([$nome, $email, $senhaHash, $tipo]);
}

function fazerLogin($email, $senha) {
    global $pdo;

    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();

    if ($usuario && password_verify($senha, $usuario['senha'])) {
        $_SESSION['usuario'] = [
            'id' => $usuario['id'],
            'nome' => $usuario['nome_completo'],
            'email' => $usuario['email'],
            'tipo' => $usuario['tipo']
        ];
        return true;
    }
    return false;
}

function estaLogado() {
    return isset($_SESSION['usuario']);
}

function redirecionarSeNaoLogado() {
    if (!estaLogado()) {
        header("Location: login.php");
        exit;
    }
}
?>
