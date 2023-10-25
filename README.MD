# PIEDRA ✊, PAPEL ✋ o TIJERA ✌️ OnLine 💻 (TypeScript - Node.js - Firebase)

## Descripcion General:
 Se trata de una App del tradicional juego de "Piedra, Papel o Tijera", diseñada en esta caso para jugarse de manera online entre dos dispositivos. 

A cada jugador se le brinda un código de sala para poder compartirlo y de esta manera, el jugador contrincante podrá inigresar y jugar.

La dirección de la app es: https://piedra-papel-o-tijera-online.onrender.com

## Arquitectura:
Se sigue el modelo MVC para trabajar por capas, y el modelo Cliente/Servidor para separar frontend de backend.

## Front:
El front está construido en TypeScript, bajo un esquema de Pages y Web Components que se van renderizando y cambiando via Router, y mediante el intercambio de información entre los componentes vía un State Manager.

 Además el consumo de datos del Front es vía "fetch" desde las distintas API´s generadas en el backend.

## Back:
El back se construye en Node.js, y mediante API's se puede brindar la información desde la base de datos Firebase, que el usuario solicita.

## Tecnologias principales:

- ##### TypeScript
- ##### Node.js
- ##### Firebase 

## Base de Datos:
Utilización de Firebase, una base de datos NoSQL - Real Time. 

## POSTMAN:
Se deja el link de la colección de Postman para corroborar las API´s: https://documenter.getpostman.com/view/21827106/2s93RUuBxB
