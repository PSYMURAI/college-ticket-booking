-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 07, 2023 at 10:10 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `form_data`
--

CREATE TABLE `form_data` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `collegeName` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `eventDay1` varchar(255) DEFAULT NULL,
  `eventDay2` varchar(255) DEFAULT NULL,
  `eventDay3` varchar(255) DEFAULT NULL,
  `paymentImage` varchar(255) DEFAULT NULL,
  `token` varchar(20) NOT NULL,
  `date_time_submit` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_data`
--

INSERT INTO `form_data` (`id`, `name`, `collegeName`, `mobile`, `email`, `eventDay1`, `eventDay2`, `eventDay3`, `paymentImage`, `token`, `date_time_submit`) VALUES
(65, 'dhananjay kakade', 'fgdfg', '0976507352', 'kakadedhananjay59@gmail.com', 'event 2', 'event 12', 'event 21', '2023-11-06_22-59-04_mcgk0001.jpg', 'mcgk0001', '2023-11-06 22:59:04'),
(66, 'dhananjay kakade', 'fgdfg', '6576567566', 'kakadedhananjay5656759@gmail.com', 'none', 'none', 'none', '2023-11-07_00-01-21_mcgk0001.jpg', 'mcgk0001', '2023-11-07 00:01:21'),
(73, 'dhananjay kakade', 'fgdfg', '8888888888', 'kakadedhananjay58889@gmail.com', 'event 2', 'event 12', 'event 22', '2023-11-07_12-58-35_mcgk0001.jpg', 'mcgk0001', '2023-11-07 12:58:35'),
(74, 'dhananjay kakade', 'fgdfg', '9999999999', 'kakadedhananjay59999@gmail.com', 'event 2', 'event 11', 'event 22', '2023-11-07_13-27-24_mcgk0001.jpg', 'mcgk0001', '2023-11-07 13:27:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `form_data`
--
ALTER TABLE `form_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mobile` (`mobile`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `form_data`
--
ALTER TABLE `form_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
