-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 02.10.2015 klo 16:28
-- Palvelimen versio: 5.6.26
-- PHP Version: 5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejs_chat`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `chat_log`
--

CREATE TABLE IF NOT EXISTS `chat_log` (
  `id` int(6) unsigned NOT NULL,
  `message` text NOT NULL,
  `avatar` varchar(128) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `ip` varchar(30) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Vedos taulusta `chat_log`
--

INSERT INTO `chat_log` (`id`, `message`, `avatar`, `email`, `ip`, `date`) VALUES
(1, 'hello', 'Ari_LOC', 'aripetaj@gmail.com', '127.0.0.1', '2015-09-24 14:48:31'),
(2, 'plip', 'FF', 'akfopaskdf@asdfasd.fi', '127.0.0.1', '2015-09-24 14:52:51'),
(3, 'cghh', 'FF', 'akfopaskdf@asdfasd.fi', '127.0.0.1', '2015-09-24 14:53:19'),
(4, 'fdgd', 'Ari_LOC', 'aripetaj@gmail.com', '127.0.0.1', '2015-09-25 12:17:23'),
(5, 'asdf', 'asdasd', 'asdsad@qwer.ri', '127.0.0.1', '2015-09-25 15:33:12'),
(6, 'dfgdgf', 'asdasd', 'asdsad@qwer.ri', '127.0.0.1', '2015-09-25 20:30:58'),
(7, 'test', 'cccc', 'aripetaj@gmail.com', '127.0.0.1', '2015-09-28 18:20:29'),
(8, 'asdfasdf', 'sdfsd', 'fsdfsdf@asdsgd.gi', '127.0.0.1', '2015-09-29 18:30:29'),
(9, 'sdf', 'sdfsd', 'fsdfsdf@asdsgd.gi', '127.0.0.1', '2015-09-29 18:30:57'),
(10, 'asdfsf', 'sdfsd', 'fsdfsdf@asdsgd.gi', '127.0.0.1', '2015-09-29 18:31:05'),
(11, '11111111111111111111111', 'sdfsd', 'fsdfsdf@asdsgd.gi', '127.0.0.1', '2015-09-29 18:32:05'),
(12, '22222222222', 'sdfsd', 'fsdfsdf@asdsgd.gi', '127.0.0.1', '2015-09-29 18:33:57');

-- --------------------------------------------------------

--
-- Rakenne taululle `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `username` varchar(128) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `password` varchar(256) CHARACTER SET utf32 COLLATE utf32_swedish_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Vedos taulusta `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `timestamp`) VALUES
(9, 'fpvonly@gmail.com', 'sha1$51b3ae58$1$22ccf025e5197e1bc5313291e7f31ef416e4558f', '0000-00-00 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_log`
--
ALTER TABLE `chat_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_log`
--
ALTER TABLE `chat_log`
  MODIFY `id` int(6) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
