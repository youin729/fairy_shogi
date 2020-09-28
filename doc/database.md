# データベース

## pre_users (仮会員登録)
|カラム|型|要素|
|---|---|---|
|id|serial|オートインクリメント|
|name|varchar(255) not null|ユーザー名|
|email|varchar(255) not null|メールアドレス|
|password|varchar(255) not null|パスワード(utf8mb4_bin)|
|languague|varchar(10)|ja-JP, en-USなど|
|code|varchar(16)|URLに記載される文字列|
|created_at|datetime default null|作成日時|
|updated_at|datetime default null|更新日時|
|deleted_at|datetime default null|ソフトデリート|

## users
|カラム|型|要素|
|---|---|---|
|id|serial|オートインクリメント|
|name|varchar(255) not null|ユーザー名|
|email|varchar(255) not null|メールアドレス|
|password|varchar(255) not null|パスワード(utf8mb4_bin)|
|languague|varchar(10)|ja-JP, en-USなど|
|rating|int(4)||
|created_at|datetime default null|作成日時|
|updated_at|datetime default null|更新日時|
|deleted_at|datetime default null|ソフトデリート|
