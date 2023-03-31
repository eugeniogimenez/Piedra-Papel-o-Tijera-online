"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const cors = require("cors");
const express = require("express");
const path = require("path");
const nanoid_1 = require("nanoid");
const rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");
const usersCollectionRef = database_1.firestore.collection("users");
const gameroomsCollectionRef = database_1.firestore.collection("gamerooms");
const port = process.env.PORT || 3000;
//API INIT AND CONFIG
const app = express();
app.use(express.json());
app.use(cors());
// ENDPOINTS
//CREATE NEW USER
// SIGNUP - CREA UN NUEVO USUARIO EN FIRESTORE
app.post("/signup", function (req, res) {
    var userName = req.body.name;
    usersCollectionRef
        .where("name", "==", userName)
        .get()
        .then(function (searchResponse) {
        // VERIFICA QUE NO HAYA UN DOC CON EL NAME IGUAL AL USER NAME
        if (searchResponse.empty) {
            //Si no lo encuentra, lo agrega
            usersCollectionRef.add({ name: userName }).then(function (newUserRef) {
                // DEVUELVE UN OBJETO CON EL ID DEL NUEVO USUARIO CORRESPONDIENTE
                res.status(200).json({
                    id: newUserRef.id,
                    new: true,
                });
            });
        }
        else {
            // SI EL NAME YA ESTABA REGRISTRADO, DEVUEVE UN MENSAJE
            res.status(400).json({
                message: `El nombre ${userName} ya corresponde a un jugador registrado.`,
            });
        }
    });
});
//CREATE NEW GAMEROOM
// CREA UN NUEVO GAMEROOM DENTRO DE LA RTDB
// Y AL MISMO TIEMPO CREA Y SETEA LOS DATOS EN FIRESTORE
app.post("/gamerooms", (req, res) => {
    const userId = req.body.userId;
    const ownerName = req.body.ownerName;
    usersCollectionRef
        .doc(userId.toString())
        .get()
        .then((doc) => {
        // VERIFICA QUE EL USUARIO EXISTA EN FIRESTORE USANDO EL ID
        // DE SER ASÍ, CREA UNA NUEVA ROOM CON UN ID
        if (doc.exists) {
            // CREAMOS LA REFERENCIA DEL NUEVO ROOM
            const newRoomRef = database_1.realtimeDB.ref("gamerooms/" + (0, nanoid_1.nanoid)(10)); //rtdb
            // SETEAMOS EL OWNER COMO EL USER QUE INGRESO EL BODY
            newRoomRef //rtdb
                .set({
                currentgame: {
                    player1: {
                        choice: "undefined",
                        online: false,
                        start: false,
                        playerName: "none",
                        playerScore: 0,
                    },
                    player2: {
                        choice: "undefined",
                        online: false,
                        start: false,
                        playerName: "none",
                        playerScore: 0,
                    },
                },
                owner: ownerName,
                ownerId: userId,
            })
                .then(() => {
                // GUARDA EL ID LARGO Y CREA UN ID CORTO PARA GUARDAR EN FIRESTORE
                const roomLongId = newRoomRef.key;
                const randonNumber = 1000 + Math.floor(Math.random() * 999);
                const roomId = "GR" + randonNumber.toString();
                // CREA UN NUEVO DOCUMENTO EN LA COLLECTION ROOMS DE FIRESTORE CON EL ID LARGO DENTRO
                gameroomsCollectionRef
                    .doc(roomId.toString())
                    .set({
                    rtdbRoomId: roomLongId,
                    score: {
                        player1: {
                            name: ownerName,
                            score: 0,
                        },
                        player2: {
                            name: "none",
                            score: "none",
                        },
                    },
                })
                    // DEVUELVE EL ID CORTO
                    .then(() => {
                    res.json({
                        id: roomId.toString(),
                    });
                });
            });
        }
        else {
            // SI NO EXISTE, DEVUELVE UN ERROR 401
            res.status(401).json({
                message: "El id del usuario no existe.",
            });
        }
    });
});
//SET PLAYER 2 SCORE
// AGREGA EL SCORE Y EL NOMBRE INICIAL DEL PLAYER 2 A FIRESTORE
app.post("/gameroomsscore/:roomid", (req, res) => {
    const gameRoomId = req.params.roomid;
    const playerName = req.body.playerName;
    gameroomsCollectionRef //firestore
        .doc(gameRoomId.toString())
        .get()
        .then((snap) => {
        const actualData = snap.data();
        actualData.score["player2"] = {
            name: playerName,
            score: 0,
        };
        gameroomsCollectionRef
            .doc(gameRoomId.toString())
            .update(actualData) //Se actualiza sólo los datos del player2
            .then(() => {
            res.json({
                message: "el score se actualizo correctamente",
            });
        });
    });
});
//ADD VICTORY POINT
// AGREGA UN PUNTO AL SCORE DE FIREBASE, PIDIENDO COMO PARAMETRO EL ROOMID
// Y EL NOMBRE DEL USUARIO Y SU POSICIÓN EN EL JUEGO COMO REFERENCIA
app.post("/gamedatascore/:roomid", (req, res) => {
    const gameRoomId = req.params.roomid;
    const playerName = req.body.playerName;
    const playerRef = req.body.playerRef;
    gameroomsCollectionRef
        .doc(gameRoomId.toString())
        .get()
        .then((snap) => {
        const actualData = snap.data();
        const newscore = actualData.score[playerRef].score + 1;
        actualData.score[playerRef] = {
            name: playerName,
            score: newscore,
        };
        gameroomsCollectionRef
            .doc(gameRoomId.toString())
            .update(actualData)
            .then(() => {
            res.json({
                message: "el score  se actualizo correctamente",
            });
        });
    });
});
//GET GAMEROOM SCORES
// DEVUELVE EL SCORE DE LA BASE DE DATOS DE FIREBASE
app.get("/gameroomsscores/:roomid", (req, res) => {
    const gameRoomId = req.params.roomid;
    gameroomsCollectionRef
        .doc(gameRoomId.toString())
        .get()
        .then((snap) => {
        const actualData = snap.data();
        res.json(actualData.score);
    });
});
// GET GAMEROOM LONG ID
// DEVUELVE EL ID LARGO VERIFICANDO EL USERID Y EL GAMEROOMID
app.get("/gamerooms/:roomId", (req, res) => {
    const { userId } = req.query;
    const { roomId } = req.params;
    // REVISA SI EL USER ID CORRESPONDE A ALGUN USUARIO DE USERS EN FIRESTORE
    usersCollectionRef
        .doc(userId.toString())
        .get()
        .then((doc) => {
        // SI EXISTE, VA A BUSCAR EL ROOM ID LARGO DENTRO DE FIRESTORE,
        // USANDO EL ID CORTO
        if (doc.exists) {
            gameroomsCollectionRef
                .doc(roomId)
                .get()
                .then((snap) => {
                // VERIFICA QUE EL ROOM EXISTA
                if (snap.exists) {
                    // TERMINA DEVOLVIENDO EL ID LARGO QUE CORRESPONDE AL ROOM
                    const data = snap.data();
                    res.json(data);
                }
                else {
                    // SI NO EXISTE, DEVUELVE UN ERROR 401
                    res.status(401).json({
                        message: "El Gameroom indicado no existe.",
                    });
                }
            });
        }
        else {
            // SI NO EXISTE EL ROOM, DEVUELVE UN ERROR 401
            res.status(401).json({
                message: "El id del usuario no existe.",
            });
        }
    });
});
// AUTHENTICATION
app.post("/auth", (req, res) => {
    var userName = req.body.name;
    usersCollectionRef
        .where("name", "==", userName)
        .get()
        .then((searchResponse) => {
        // VERIFICA QUE EL NOMBRE DEL USER EXISTA EN ALGUN DOC
        if (searchResponse.empty) {
            res.status(404).json({
                message: "El nombre que ingresaste no corresponde a un usuario registrado.",
            });
        }
        else {
            //DEVUELVE EL ID DEL USER IDENTIFICADO
            res.status(200).json({
                id: searchResponse.docs[0].id,
            });
        }
    });
});
//CONNECT PLAYER, RESTART PLAYER, START PLAYER, MAKE AND CHOICE
// CONNECTA A LOS JUGADORES AL GAMEROOM
app.post("/gamedata/:id", function (req, res) {
    const player = req.query.player;
    const playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, () => {
        res.status(201).json({ message: player + " conectado" });
    });
});
//READY PLAYER TO PLAY
// DEFINE QUE EL JUGADOR ESTA LISTO PARA INICIAR
app.post("/gamestart/:id", function (req, res) {
    const player = req.query.player;
    const playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, () => {
        res.status(201).json({ message: player + " listo para jugar" });
    });
});
//DISCONNECT PLAYER
// DESCONECTA A LOS JUGADORES DEL GAMEROOM
app.post("/disconectplayer/:id", function (req, res) {
    const player = req.query.player;
    const playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, () => {
        res.status(201).json({ message: player + " desconectado" });
    });
});
// RESET THE PLAY AND SEND THE PLAYERS TO THE GAMEROOM
// RESETEA LA JUGADA Y ENVIA A LOS JUGADORES AL GAMEROOM
app.post("/restartplayer/:id", function (req, res) {
    const player = req.query.player;
    const playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, () => {
        res.status(201).json({ message: player + " desconectado" });
    });
});
// PLAYER IS READY TO START
// DEFINE QUE EL JUGADOR ESTA LISTO PARA INICIAR
app.post("/gamestart/:id", function (req, res) {
    const player = req.query.player;
    const playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, () => {
        res.status(201).json({ message: player + " listo para jugar" });
    });
});
// PLAYER ALREADY PLAYED
// DEFINE QUE EL JUGADOR YA JUGÓ
app.post("/handchoice/:id", function (req, res) {
    const player = req.query.player;
    const playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, () => {
        res.status(201).json({ message: player + " realizo su jugada" });
    });
});
// EXPRESS STATIC
app.use(express.static("dist"));
// RETURN TO INDEX.HTML
app.get("*", (req, res) => {
    res.sendFile(`${rutaRelativa}`);
});
//API LISTEN
app.listen(port, () => {
    console.log(`Estamos conectados al puerto: ${port}`);
});
