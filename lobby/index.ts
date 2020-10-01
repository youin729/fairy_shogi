import * as io from "socket.io-client";

const socket = io('/lobby');

interface chatData {
    userId: number,
    userName: string,
    Message: string,
}

interface preGame {
    userId: number,
    userName: string,
    color: string,
    initial: number,
    timerule: string,
    increment: number,
    countdown: number,
}

document.getElementById("chat-send").onclick = function() {
    const bodyEl = <HTMLInputElement>document.querySelector("#chat-message-body");
    const idEl = <HTMLInputElement>document.getElementById("chat-id");
    const nameEl = <HTMLInputElement>document.getElementById("chat-name");

    const sendData:chatData = {
        userId: parseInt(idEl.value),
        userName: nameEl.value,
        Message: bodyEl.value,
    }
    socket.emit('chat', sendData);
    bodyEl.value = "";
    return false;
}

document.getElementById("game-create").onsubmit = function() {
    const formEl = document.forms['game-create'];

    const uid = formEl.elements['user-id'].value,
    uname = formEl.elements['user-name'].value,
    color = formEl.elements['color'].value,
    initial = formEl.elements['initial'].value,
    timerule = formEl.elements['timerule'].value,
    increment = formEl.elements['increment'].value,
    countdown = formEl.elements['countdown'].value;

    const preGame:preGame = {
        userId: uid,
        userName: uname,
        color: color,
        initial: initial,
        timerule: timerule,
        increment: increment,
        countdown: countdown,
    }
    socket.emit('create', preGame);
    return false;
}

socket.emit('connected', socket => {
    socket.join('default');
});

socket.on('chat', function(c:chatData){
    let newEl = document.createElement("p");
    newEl.innerHTML = c.userName + "：" + c.Message;

    const chatEl = document.querySelector("#lobby_chat");
    chatEl.insertBefore(newEl, chatEl.getElementsByTagName("p")[1]);
});
