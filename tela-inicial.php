<?php
require 'auth_functions.php';
redirecionarSeNaoLogado();

$usuario = $_SESSION['usuario'];
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <title>Dashboard - SIGA</title>
    <link rel="stylesheet" href="tela-inicial.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>

<body>
    <div class="siga">
        <aside class="sidebar">
            <div class="logo">
                <i class="fas fa-graduation-cap"></i>
                <h1>SIGA</h1>
            </div>
            <nav>
                <ul>
                    <li class="active"><a href="tela-inicial.php"><i class="fas fa-home"></i> Principal</a></li>
                    <li><a href="alunos.html"><i class="fas fa-users"></i> Alunos</a></li>
                    <li><a href="turmas.html"><i class="fas fa-book"></i> Turmas</a></li>
                    <li><a href="recomendacoes.html"><i class="fas fa-lightbulb"></i> Recomendações</a></li>
                </ul>
            </nav>

            <div class="logout-container">
                <a href="logout.php" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Sair</span>
                </a>
            </div>
        </aside>

        <main class="content">
            <header class="header">
                <h2>Bem-vindo, <?= htmlspecialchars($usuario['nome']) ?></h2>
                <div class="user-profile">
                    <span><?= ucfirst(htmlspecialchars($usuario['tipo'])) ?></span>
                    <i class="fas fa-user-circle"></i>
                </div>
            </header>

            <div class="cards">
                <div class="card">
                    <div class="card-icon blue">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="card-info">
                        <h3>Alunos</h3>
                        <p id="total-alunos">0</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-icon green">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="card-info">
                        <h3>Turmas</h3>
                        <p id="total-turmas">0</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-icon orange">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <div class="card-info">
                        <h3>Pendências</h3>
                        <p id="total-pendencias">0</p>
                    </div>
                </div>
            </div>

            <section>
                <?php if ($usuario['tipo'] === 'admin'): ?>
                    <h3>Painel Administrativo</h3>
                <?php elseif ($usuario['tipo'] === 'professor'): ?>
                    <h3>Painel do Professor</h3>
                <?php else: ?>
                    <h3>Painel do Aluno</h3>
                <?php endif; ?>
            </section>

            <div class="recent-students">
                <h3><i class="fas fa-clock"></i> Alunos Recentes</h3>
                <table id="tabela-alunos">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Turma</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Dados virão via JavaScript ou PHP futuramente -->
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <script src="main.js"></script>
</body>

</html>
