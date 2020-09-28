CREATE TABLE IF NOT EXISTS `users` (
  `id` serial NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `languague` varchar(10) NOT NULL,
  `rating` int(4) NOT NULL,
  `online` tinyint(1) NOT NULL,
  `created_at` datetime default NULL,
  `updated_at` datetime default NULL,
  `deleted_at` datetime default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_email` (`email`);
