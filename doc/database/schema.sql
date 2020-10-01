CREATE TABLE IF NOT EXISTS `pre_users` (
  `id` serial NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `languague` varchar(10) NOT NULL,
  `created_at` datetime default NULL,
  `updated_at` datetime default NULL,
  `deleted_at` datetime default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `pre_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_email` (`email`);


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

CREATE TABLE IF NOT EXISTS `pre_games` (
  `id` serial NOT NULL,
  `hash` varchar(12) NOT NULL,
  `black_user_id` varchar(255) NOT NULL,
  `black_user_name` varchar(255) NOT NULL,
  `white_user_id` varchar(255) NOT NULL,
  `white_user_name` varchar(255) NOT NULL,
  `initial` int(6) NOT NULL COMMENT '持ち時間',
  `increment` int(3) DEFAULT NULL COMMENT 'フィッシャー追加時間 ルールでない場合はNULL',
  `countdown` int(3) DEFAULT NULL COMMENT 'カウントダウン制持ち時間 ルールでない場合はNULL',
  `tackbackable` tinyint(1) NOT NULL,
  `moretimeable` tinyint(1) NOT NULL,
  `created_at` datetime default NULL,
  `updated_at` datetime default NULL,
  `deleted_at` datetime default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `pre_games`
  ADD PRIMARY KEY (`id`);
