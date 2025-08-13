CREATE DATABASE siga_db;
USE siga_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('aluno', 'professor', 'admin') DEFAULT 'aluno',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
