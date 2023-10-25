# PIEDRA ✊, PAPEL ✋ o TIJERA ✌️ OnLine 💻 (TypeScript - Node.js - Firebase)

## Descripcion General:
 Se trata de una App del tradicional juego de "Piedra, Papel o Tijera", diseñada en esta caso para jugarse de manera online entre dos dispositivos. 

A cada jugador se le brinda un código de sala para poder compartirlo y de esta manera, el jugador contrincante podrá inigresar y jugar.

## Uso:
La dirección de la app es: https://piedra-papel-o-tijera-online.onrender.com


## Front:
El front está construido en TypeScript, bajo un esquema de Pages y Web Components que se van renderizando via Router, y mediante el intercambio de información entre los componentes vía un State Manager.

 Además el consumo de datos del Front es vía "fetch" desde las distintas API´s generadas en el backend.

## Back:
El back se construye en base a Servlets para las distinas funciones.  Las tecnologías usadas principalmente son:

- ##### JAVA <a href="https://www.java.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" alt="java" width="30" height="30"/> </a>
- ##### Servlets
- ##### Docker <a href="https://www.docker.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="30" height="30"/> </a>
- ##### MySQL <a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="30" height="30"/> </a>
- ##### JPA (EclipseLink)
- ##### JSP
- ##### Boostrap <a href="https://getbootstrap.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-plain-wordmark.svg" alt="bootstrap" width="30" height="30"/> </a>

## Arquitectura:
Se sigue el modelo MVC para trabajar por capas, principalmente las de Logica y Persistencia.

## Base de Datos:
Utilización de MySQL <a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="30" height="30"/> </a> mediante el servicio de Clever Cloud.

## Docker <a href="https://www.docker.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a>:
La app se dockerizó para su posterior despliegue.

## Diagrama UML:
Se adjunta el diagrama UML donde se muestran las distintas relaciones de clases.

https://drive.google.com/file/d/13NLkbEsxkjllju42LSSjwZ-1V499CiKj/view?usp=sharing
