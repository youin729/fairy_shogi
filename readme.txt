npm init
# express install
npm install express --save
npm install --save express-session

# mailserver
npm install nodemailer -save

#mysql
npm install mysql -save

# socket.io install
npm install socket.io --save

# 不要？
npm install socket.io-client --save

# typescript環境でloadするために必要
npm install @types/socket.io-client --save

#pugを入れる (expressのテンプレート用エンジン)
npm install --save pug



node index.js
⇒サーバー起動

herokuへのコミット
$ git add .
$ git commit -m "commit message"
$ heroku create
$ git push heroku master
$ heroku open

rootパスワード
Du!yn!d8_$

---------------------

盤や駒種類を変更する場合
pieces.tsを変更する。
cssを変更する。
gamedata.tsを変更する。


画面一覧
　ロビー画面
　　- 会員登録
　　- 対局画面

対局画面
　棋譜読み込み
　　手の移動 (前へ/次へ)
　棋譜表示

　タイマー表示
　　持ち時間
　　　フィッシャー
　　　持ち時間方式

どこに駒がどれだけ

CSA ⇒ FEN

テストサーバーを構築する。
⇒ドメイン

css方針
============================

左サイドメニュー
真ん中列は2カラムと1カラムスタイル
1カラムは
　対局画面
　練習画面
　フォーラムなど
2カラムは
　ロビー

common.css ⇒ 汎用
nav.css ⇒ 

ラウンド中、検討中

============================
gameDataのinterfaceは別定義になってしまう？


expressで会員登録できるようにする。

DB接続
