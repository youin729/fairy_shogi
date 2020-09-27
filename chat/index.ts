import * as io from "socket.io-client";

const socket = io();

interface chatData {
    userId: number,
    Message: string,
}

document.getElementById("chat-send").onclick = function() {
    const bodyEl = <HTMLInputElement>document.getElementById("chat-message-body");
    const sendData:chatData = {
        userId: 22,
        Message: bodyEl.value,
    }
    socket.emit('chat', sendData);
    bodyEl.value = "";
    return false;
}

socket.on('chat', function(c:chatData){
    let newEl = document.createElement("p");
    newEl.innerHTML = "ユーザー" + c.userId + "：" + c.Message;


    const chatEl = document.getElementById("lobby-chat");
    chatEl.insertBefore(newEl, chatEl.getElementsByTagName("p")[1]);
});
