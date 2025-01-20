-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 20, 2025 at 03:07 PM
-- Server version: 8.0.40-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `area`
--

-- --------------------------------------------------------

--
-- Table structure for table `actions`
--

CREATE TABLE `actions` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `api_name` varchar(255) NOT NULL,
  `labels` json DEFAULT NULL,
  `input` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `actions`
--

INSERT INTO `actions` (`id`, `title`, `description`, `api_name`, `labels`, `input`) VALUES
(1, 'Listen to music', 'Is listening to music', 'Spotify', '[{\"name\": \"Artist Name\", \"value\": \"artistName\"}, {\"name\": \"Song Name\", \"value\": \"songName\"}]', '[]'),
(4, 'Listen specific sound', 'When you listen to a specific sound', 'Spotify', '[{\"name\": \"Artist Name\", \"value\": \"artistName\"}, {\"name\": \"Song Name\", \"value\": \"songName\"}]', '[{\"name\": \"songName\", \"type\": \"text\", \"description\": \"The sound to compare with\"}]'),
(5, 'Event today', 'When you have an event for today', 'Google', '[{\"name\": \"Event Title\", \"value\": \"title\"}, {\"name\": \"Email of the creator\", \"value\": \"creator_email\"}, {\"name\": \"Link to the event\", \"value\": \"link\"}]', '[]'),
(7, 'User is streaming', 'User is streaming', 'Twitch', '[{\"name\": \"Game Name\", \"value\": \"game_name\"}, {\"name\": \"Title of the stream\", \"value\": \"title\"}, {\"name\": \"Viewers count\", \"value\": \"viewer_count\"}]', '[{\"name\": \"StreamUsername\", \"type\": \"text\", \"description\": \"the streamer to check\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `actions_api`
--

CREATE TABLE `actions_api` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `actions_api`
--

INSERT INTO `actions_api` (`id`, `name`, `icon_url`) VALUES
(1, 'Twitch', 'https://img.freepik.com/vecteurs-premium/logo-medias-sociaux-vector-twitch_1093524-449.jpg?semt=ais_hybrid'),
(3, 'Spotify', 'https://m.media-amazon.com/images/I/51rttY7a+9L.png'),
(4, 'Google', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/1024px-Google_Calendar_icon_%282020%29.svg.png'),
(5, 'Nexus', NULL),
(6, 'Github', 'https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png');

-- --------------------------------------------------------

--
-- Table structure for table `preset_configs`
--

CREATE TABLE `preset_configs` (
  `id` int NOT NULL,
  `actions_id` int NOT NULL,
  `reaction_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `preset_configs`
--

INSERT INTO `preset_configs` (`id`, `actions_id`, `reaction_id`) VALUES
(1, 5, 7),
(2, 4, 1),
(3, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `reactions`
--

CREATE TABLE `reactions` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `api_name` varchar(255) NOT NULL,
  `input` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `reactions`
--

INSERT INTO `reactions` (`id`, `title`, `description`, `api_name`, `input`) VALUES
(1, 'Create clip', 'Create a clip from a twitch stream.', 'Twitch', '[{\"name\": \"username\", \"type\": \"text\", \"description\": \"The broadcaster username\"}]'),
(2, 'Skip to next', 'Skip to next song', 'Spotify', '[]'),
(3, 'Skip to previous', 'Skip to previous song', 'Spotify', '[]'),
(4, 'Send message in chat', 'Send a message in a twitch chat', 'Twitch', '[{\"name\": \"username\", \"type\": \"text\", \"description\": \"The broadcaster username\"}, {\"name\": \"message\", \"type\": \"text\", \"description\": \"The message to send\"}]'),
(6, 'Create Pull Request', 'Create Pull Request', 'Github', '[{\"name\": \"owner\", \"type\": \"text\", \"description\": \"The owner username\"}, {\"name\": \"repo\", \"type\": \"text\", \"description\": \"The name of the repository\"}, {\"name\": \"prTitle\", \"type\": \"text\", \"description\": \"A name for the pull request\"}, {\"name\": \"prBody\", \"type\": \"text\", \"description\": \"A content for the pull request\"}, {\"name\": \"prHeadBranch\", \"type\": \"text\", \"description\": \"The head branch for the pull request\"}, {\"name\": \"prBaseBranch\", \"type\": \"text\", \"description\": \"The base branch for the pull request\"}, {\"name\": \"prIsDraft\", \"type\": \"bool\", \"description\": \"Create this PR as a draft ?\"}]'),
(7, 'Start music', 'Plays a music on spotify', 'Spotify', '[{\"name\": \"songName\", \"type\": \"text\", \"description\": \"The sound to play\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `reactions_api`
--

CREATE TABLE `reactions_api` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `reactions_api`
--

INSERT INTO `reactions_api` (`id`, `name`, `icon_url`) VALUES
(1, 'Twitch', 'https://img.freepik.com/vecteurs-premium/logo-medias-sociaux-vector-twitch_1093524-449.jpg?semt=ais_hybrid'),
(3, 'Spotify', 'https://m.media-amazon.com/images/I/51rttY7a+9L.png'),
(4, 'Google', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/1024px-Google_Calendar_icon_%282020%29.svg.png'),
(5, 'Nexus', NULL),
(6, 'Github', 'https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `picture_url` varchar(255) DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `usersToken`
--

CREATE TABLE `usersToken` (
  `email` varchar(255) NOT NULL,
  `githubAccessToken` varchar(255) DEFAULT NULL,
  `githubRefreshToken` varchar(255) DEFAULT NULL,
  `twitchAccessToken` varchar(255) DEFAULT NULL,
  `twitchRefreshToken` varchar(255) DEFAULT NULL,
  `spotifyAccessToken` varchar(2550) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `spotifyRefreshToken` varchar(255) DEFAULT NULL,
  `discordAccessToken` varchar(255) DEFAULT NULL,
  `discordRefreshToken` varchar(255) DEFAULT NULL,
  `unsplashAccessToken` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `unsplashRefreshToken` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `googleAccessToken` varchar(255) DEFAULT NULL,
  `googleRefreshToken` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `users_configs`
--

CREATE TABLE `users_configs` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `actions_id` int NOT NULL,
  `method` enum('GET','POST','PUT','DELETE') DEFAULT NULL,
  `headers` json DEFAULT NULL,
  `body` json DEFAULT NULL,
  `reaction_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actions`
--
ALTER TABLE `actions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_name` (`api_name`);

--
-- Indexes for table `actions_api`
--
ALTER TABLE `actions_api`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `preset_configs`
--
ALTER TABLE `preset_configs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `actions_id` (`actions_id`),
  ADD KEY `reaction_id` (`reaction_id`);

--
-- Indexes for table `reactions`
--
ALTER TABLE `reactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `api_name` (`api_name`);

--
-- Indexes for table `reactions_api`
--
ALTER TABLE `reactions_api`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `password` (`password`);

--
-- Indexes for table `usersToken`
--
ALTER TABLE `usersToken`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `users_configs`
--
ALTER TABLE `users_configs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `actions_id` (`actions_id`),
  ADD KEY `email` (`email`),
  ADD KEY `reaction_id` (`reaction_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actions`
--
ALTER TABLE `actions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `actions_api`
--
ALTER TABLE `actions_api`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `preset_configs`
--
ALTER TABLE `preset_configs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reactions`
--
ALTER TABLE `reactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `reactions_api`
--
ALTER TABLE `reactions_api`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users_configs`
--
ALTER TABLE `users_configs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `actions`
--
ALTER TABLE `actions`
  ADD CONSTRAINT `actions_ibfk_1` FOREIGN KEY (`api_name`) REFERENCES `actions_api` (`name`);

--
-- Constraints for table `preset_configs`
--
ALTER TABLE `preset_configs`
  ADD CONSTRAINT `preset_configs_ibfk_1` FOREIGN KEY (`actions_id`) REFERENCES `actions` (`id`),
  ADD CONSTRAINT `preset_configs_ibfk_2` FOREIGN KEY (`reaction_id`) REFERENCES `reactions` (`id`);

--
-- Constraints for table `reactions`
--
ALTER TABLE `reactions`
  ADD CONSTRAINT `reactions_ibfk_1` FOREIGN KEY (`api_name`) REFERENCES `reactions_api` (`name`);

--
-- Constraints for table `usersToken`
--
ALTER TABLE `usersToken`
  ADD CONSTRAINT `usersToken_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`);

--
-- Constraints for table `users_configs`
--
ALTER TABLE `users_configs`
  ADD CONSTRAINT `users_configs_ibfk_1` FOREIGN KEY (`actions_id`) REFERENCES `actions` (`id`),
  ADD CONSTRAINT `users_configs_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `users_configs_ibfk_3` FOREIGN KEY (`reaction_id`) REFERENCES `reactions` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
