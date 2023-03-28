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
// SIGNUP - CREA UN NUEVO USUARIO EN FIRESTORE
app.post("/signup", function (req, res) {
    var userName = req.body.name;
    usersCollectionRef
        .where("name", "==", userName)
        .get()
        .then(function (searchResponse) {
        // VERIFICA QUE NO HAYA UN DOC CON EL EMAIL IGUAL AL USER EMAIL
        if (searchResponse.empty) {
            usersCollectionRef.add({ name: userName }).then(function (newUserRef) {
                // DEVUELVE UN OBJETO CON EL ID DEL NUEVO USUSARIO CORRESPONDIENTE
                res.status(200).json({
                    id: newUserRef.id,
                    new: true,
                });
            });
        }
        else {
            // SI EL EMAIL YA ESTABA REGRISTRADO EN UN USER, DEVUELVE EL ID DEL USUARIO CORRESPONDIENTE
            res.status(400).json({
                message: "El nombre que ingresaste ya corresponde a un jugador registrado.",
            });
        }
    });
});
// CREA UN NUEVO GAMEROOM DENTRO DE LA RTDB Y AL MISMO TIEMPO SETEA CREA Y SETEA LOS DATOS EN FIRESTORE
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
            const newRoomRef = database_1.realtimeDB.ref("gamerooms/" + (0, nanoid_1.nanoid)(10));
            // STEAMOS EL OWNER COMO EL USER QUE INGRESO EL BODY
            newRoomRef
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
// AGREGA EL SCORE Y EL NOMBRE INICIAL DEL PLAYER 2 A FIRESTORE
app.post("/gameroomsscore/:roomid", (req, res) => {
    const gameRoomId = req.params.roomid;
    const playerName = req.body.playerName;
    gameroomsCollectionRef
        .doc(gameRoomId.toString())
        .get()
        .then((snap) => {
        const actualData = snap.data();
        console.log(actualData);
        actualData.score["player2"] = {
            name: playerName,
            score: 0,
        };
        gameroomsCollectionRef
            .doc(gameRoomId.toString())
            .update(actualData)
            .then(() => {
            res.json({
                message: "el score se actualizo correctamente",
            });
        });
    });
});
// AGREGA UN PUNTO AL SCORE DE FIREBASE, PIDIENDO PARAMETRO EL ROOMID Y EL NOMBRE DEL USUARIO Y SU POSICIÓN EN EL JUEGO COMO REFERENCIA
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
// DEVUELVE EL ID LARGO VERIFICANDO EL USERID Y EL GAMEROOMID
app.get("/gamerooms/:roomId", (req, res) => {
    const { userId } = req.query;
    const { roomId } = req.params;
    console.log(roomId);
    // REVISA SI EL USER ID CORRESPONDE A ALGUN USUARIO DE USERS EN FIRESTORE
    usersCollectionRef
        .doc(userId.toString())
        .get()
        .then((doc) => {
        // SI EXISTE, VA A BUSCAR EL ROOM ID LARGO DENTRO DE FIRESTORE, USANDO EL ID CORTO
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
            // SI NO EXISTE, DEVUELVE UN ERROR 401
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
        // VERIFICA QUE EL EMAIL DEL USER EXISTA EN ALGUN DOC
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
// CONNECTA A LOS JUGADORES AL GAMEROOM
app.post("/gamedata/:id", function (req, res) {
    const player = req.query.player;
    const playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, () => {
        res.status(201).json({ message: player + " conectado" });
    });
});
// DEFINE QUE EL JUGADOR ESTA LISTO PARA INICIAR
app.post("/gamestart/:id", function (req, res) {
    const player = req.query.player;
    const playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, () => {
        res.status(201).json({ message: player + " listo para jugar" });
    });
});
// DESCONECTA A LOS JUGADORES AL GAMEROOM
app.post("/disconectplayer/:id", function (req, res) {
    const player = req.query.player;
    const playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, () => {
        res.status(201).json({ message: player + "desconectado" });
    });
});
// RESETEA LA JUGADA Y ENVIA A LOS JUGADORES AL GAMEROOM
app.post("/restartplayer/:id", function (req, res) {
    const player = req.query.player;
    const playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, () => {
        res.status(201).json({ message: player + "desconectado" });
    });
});
// DEFINE QUE EL JUGADOR ESTA LISTO PARA INICIAR
app.post("/gamestart/:id", function (req, res) {
    const player = req.query.player;
    const playerRef = database_1.realtimeDB.ref("/gamerooms/" + req.params.id + "/currentgame/" + player);
    return playerRef.update(req.body, () => {
        res.status(201).json({ message: player + " listo para jugar" });
    });
});
// DEFINE QUE EL JUGADOR ESTA LISTO PARA INICIAR
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
