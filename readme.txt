npm init
# express install
npm install express --save

# socket.io install
npm install socket.io --save

# 不要？
npm install socket.io-client --save

# typescript環境でloadするために必要
npm install @types/socket.io-client --save

node index.js
⇒サーバー起動

herokuへのコミット
$ git add .
$ git commit -m "commit message"
$ heroku create
$ git push heroku master
$ heroku open


---------------------

盤や駒種類を変更する場合
pieces.tsを変更する。
cssを変更する。
gamedata.tsを変更する。


