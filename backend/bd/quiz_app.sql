-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 23 mai 2025 à 10:37
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `quiz_app`
--

-- --------------------------------------------------------

--
-- Structure de la table `answers`
--

DROP TABLE IF EXISTS `answers`;
CREATE TABLE IF NOT EXISTS `answers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int DEFAULT NULL,
  `answer_text` text NOT NULL,
  `is_correct` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`)
) ENGINE=MyISAM AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `answers`
--

INSERT INTO `answers` (`id`, `question_id`, `answer_text`, `is_correct`) VALUES
(93, 1013, 'Rapid Allocation Memory', 0),
(92, 1013, 'Random Access Memory', 1),
(91, 1013, 'Read Access Memory', 0),
(90, 1012, 'Android', 0),
(89, 1012, 'Windows', 1),
(88, 1012, 'MacOS', 0),
(87, 1012, 'Linux', 0),
(86, 1011, 'Python', 0),
(85, 1011, 'Java', 0),
(84, 1011, 'HTML', 1),
(83, 1011, 'CSS', 0),
(82, 1003, 'Mars', 0),
(81, 1003, 'Terre', 0),
(80, 1003, 'Vénus', 0),
(79, 1003, 'Mercure', 1),
(78, 1002, 'Émile Zola', 0),
(77, 1002, 'Gustave Flaubert', 0),
(76, 1002, 'Molière', 0),
(75, 1002, 'Victor Hugo', 1),
(74, 1001, 'Océan Arctique', 0),
(73, 1001, 'Océan Pacifique', 1),
(72, 1001, 'Océan Indien', 0),
(71, 1001, 'Océan Atlantique', 0),
(94, 1013, 'Restart All Memory', 0),
(95, 1021, '54', 0),
(96, 1021, '56', 1),
(97, 1021, '58', 0),
(98, 1021, '64', 0),
(99, 1022, '6', 0),
(100, 1022, '7', 1),
(101, 1022, '8', 0),
(102, 1022, '9', 0),
(103, 1023, '10', 0),
(104, 1023, '15', 0),
(105, 1023, '20', 1),
(106, 1023, '25', 0),
(107, 1024, 'r1', 1),
(108, 1024, 'r2', 0),
(109, 1025, 'rep1', 0),
(110, 1025, 'rep2', 1),
(111, 1026, 'rep1', 1),
(112, 1026, 'rep2', 0);

-- --------------------------------------------------------

--
-- Structure de la table `questions`
--

DROP TABLE IF EXISTS `questions`;
CREATE TABLE IF NOT EXISTS `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int DEFAULT NULL,
  `question_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `quiz_id` (`quiz_id`)
) ENGINE=MyISAM AUTO_INCREMENT=1027 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `questions`
--

INSERT INTO `questions` (`id`, `quiz_id`, `question_text`, `created_at`) VALUES
(1011, 101, 'Quel langage est utilisé pour structurer une page web ?', '2025-05-22 10:12:13'),
(1003, 100, 'Quelle planète est la plus proche du Soleil ?', '2025-05-22 10:12:13'),
(1002, 100, 'Qui a écrit Les Misérables ?', '2025-05-22 10:12:13'),
(1001, 100, 'Quel est le plus grand océan du monde ?', '2025-05-22 10:12:13'),
(1012, 101, 'Quel système d\'exploitation est développé par Microsoft ?', '2025-05-22 10:12:13'),
(1013, 101, 'Que signifie “RAM” ?', '2025-05-22 10:12:13'),
(1021, 102, 'Combien font 7 × 8 ?', '2025-05-22 10:12:13'),
(1022, 102, 'Quelle est la racine carrée de 49 ?', '2025-05-22 10:12:13'),
(1023, 102, 'Le périmètre d’un carré de côté 5 est :', '2025-05-22 10:12:13');

-- --------------------------------------------------------

--
-- Structure de la table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
CREATE TABLE IF NOT EXISTS `quizzes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `quizzes`
--

INSERT INTO `quizzes` (`id`, `title`, `description`, `created_at`, `user_id`) VALUES
(100, 'Culture Générale', 'Un quiz varié pour tester vos connaissances générales.', '2025-05-22 10:12:13', 3),
(101, 'Informatique de base', 'Testez vos bases en informatique.', '2025-05-22 10:12:13', 3),
(102, 'Quiz de maths', 'Quelques questions simples sur les maths.', '2025-05-22 10:12:13', 3);

-- --------------------------------------------------------

--
-- Structure de la table `scores`
--

DROP TABLE IF EXISTS `scores`;
CREATE TABLE IF NOT EXISTS `scores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `quiz_id` int DEFAULT NULL,
  `score` int DEFAULT '0',
  `completed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `duration_seconds` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `quiz_id` (`quiz_id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `scores`
--

INSERT INTO `scores` (`id`, `user_id`, `quiz_id`, `score`, `completed_at`, `duration_seconds`) VALUES
(18, 3, 100, 100, '2025-05-22 11:19:58', 6),
(17, 3, 100, 0, '2025-05-22 11:14:13', 7),
(19, 3, 101, 33, '2025-05-22 11:21:20', 17),
(20, 3, 100, 33, '2025-05-22 20:43:11', 7),
(21, 3, 100, 67, '2025-05-22 20:44:03', 10),
(22, 9, 104, 0, '2025-05-23 10:28:28', 4),
(23, 9, 104, 100, '2025-05-23 10:28:37', 3);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(3, 'amani123', 'amanigharbi9@gmail.com', '$2b$10$4zrV6PEplx0q2lRJL.I.aeBknA.Dr3ZQTwkT4fWiNWFPpLzS9EWW.', '2025-05-16 12:10:53');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
