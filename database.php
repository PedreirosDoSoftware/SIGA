<?php
$host = 'localhost';
$port = '3307'; // <- porta atual do seu MySQL
$dbname = 'siga_db';
$user = 'root';
$pass = ''; // coloque sua senha aqui, se tiver

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro ao conectar: " . $e->getMessage());
}
?>
