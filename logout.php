<?php
session_start();

// Verifica se o usuário confirmou o logout
if (isset($_POST['confirmar'])) {
    // Destroi todas as variáveis de sessão
    $_SESSION = array();

    // Se deseja destruir o cookie de sessão também
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Destroi a sessão
    session_destroy();

    // Redireciona para a página de login
    header("Location: index.php");
    exit;
}

// Se não confirmou, mostra a tela de confirmação
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Confirmar Saída - SIGA</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        
        .logout-wrapper {
            width: 100%;
            max-width: 500px;
            padding: 20px;
        }
        
        .logout-container {
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            padding: 40px;
            text-align: center;
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .logout-icon {
            font-size: 50px;
            color: #e74c3c;
            margin-bottom: 20px;
        }
        
        .logout-title {
            color: #333;
            margin-bottom: 15px;
            font-size: 24px;
        }
        
        .logout-message {
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
            line-height: 1.5;
        }
        
        .logout-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
        }
        
        .logout-btn {
            padding: 12px 25px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
        }
        
        .btn-confirm {
            background-color: #e74c3c;
            color: white;
            border: none;
        }
        
        .btn-confirm:hover {
            background-color: #c0392b;
            transform: translateY(-2px);
        }
        
        .btn-cancel {
            background-color: #f8f9fa;
            color: #333;
            border: 1px solid #ddd;
        }
        
        .btn-cancel:hover {
            background-color: #e9ecef;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="logout-wrapper">
        <div class="logout-container">
            <i class="fas fa-sign-out-alt logout-icon"></i>
            <h2 class="logout-title">Deseja realmente sair?</h2>
            <p class="logout-message">Você será desconectado do sistema.</p>
            
            <form method="post" class="logout-buttons">
                <button type="submit" name="confirmar" class="logout-btn btn-confirm">
                    <i class="fas fa-check"></i> Sim, sair
                </button>
                <a href="dashboard.php" class="logout-btn btn-cancel">
                    <i class="fas fa-times"></i> Cancelar
                </a>
            </form>
        </div>
    </div>
</body>
</html>
