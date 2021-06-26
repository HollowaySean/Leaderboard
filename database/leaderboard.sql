-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 26, 2021 at 09:12 AM
-- Server version: 10.3.29-MariaDB-0ubuntu0.20.04.1
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `leaderboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `decks`
--

CREATE TABLE `decks` (
  `deckID` int(11) NOT NULL,
  `deckName` tinytext NOT NULL,
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `groupDecks`
--

CREATE TABLE `groupDecks` (
  `groupID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `deckID` int(11) NOT NULL,
  `mu` float NOT NULL DEFAULT 25,
  `sigma` float NOT NULL DEFAULT 8.33333
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `groupMatches`
--

CREATE TABLE `groupMatches` (
  `groupID` int(11) NOT NULL,
  `matchNum` int(11) NOT NULL,
  `deck1` int(11) NOT NULL,
  `isWinner1` tinyint(1) NOT NULL,
  `deck2` int(11) NOT NULL,
  `isWinner2` tinyint(1) NOT NULL,
  `deck3` int(11) DEFAULT NULL,
  `isWinner3` tinyint(1) NOT NULL,
  `deck4` int(11) DEFAULT NULL,
  `isWinner4` tinyint(1) NOT NULL,
  `deck5` int(11) DEFAULT NULL,
  `isWinner5` tinyint(1) NOT NULL,
  `deck6` int(11) DEFAULT NULL,
  `isWinner6` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `groupMembers`
--

CREATE TABLE `groupMembers` (
  `groupID` int(11) NOT NULL,
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `groupRecords`
--

CREATE TABLE `groupRecords` (
  `groupID` int(11) NOT NULL,
  `matchNum` int(11) NOT NULL,
  `deckID` int(11) NOT NULL,
  `newRating` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `groupID` int(11) NOT NULL,
  `groupName` tinytext NOT NULL,
  `inviteCode` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `userName` tinytext NOT NULL,
  `hash` binary(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `decks`
--
ALTER TABLE `decks`
  ADD PRIMARY KEY (`deckID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `groupDecks`
--
ALTER TABLE `groupDecks`
  ADD KEY `groupID` (`groupID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `deckID` (`deckID`);

--
-- Indexes for table `groupMembers`
--
ALTER TABLE `groupMembers`
  ADD KEY `userID` (`userID`),
  ADD KEY `groupID` (`groupID`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`groupID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `decks`
--
ALTER TABLE `decks`
  MODIFY `deckID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `groupID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `decks`
--
ALTER TABLE `decks`
  ADD CONSTRAINT `decks userID Check` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);

--
-- Constraints for table `groupDecks`
--
ALTER TABLE `groupDecks`
  ADD CONSTRAINT `groupDecks deckID check` FOREIGN KEY (`deckID`) REFERENCES `decks` (`deckID`),
  ADD CONSTRAINT `groupDecks groupID check` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`),
  ADD CONSTRAINT `groupDecks userID check` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);

--
-- Constraints for table `groupMembers`
--
ALTER TABLE `groupMembers`
  ADD CONSTRAINT `groupMembers groupID check` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`),
  ADD CONSTRAINT `groupMembers userID check` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
