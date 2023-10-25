# PIEDRA ✊, PAPEL ✋ o TIJERA ✌️ OnLine 💻 (TypeScript - Node.js)

## Descripcion General:
El proyecto consiste en un sistema para la administración de un Consultorio Odontológico. Está pensado principalmente para ser manejado por un secretario administrativo y los distintos odontólogos.

 Permite básicamente la carga de pacientes, con sus respectivos datos, tratamientos, y  asignaciones de turnos.

 Posee un sistema de login para seguridad.

## Uso:
La dirección de la app es: https://consultorio-odontologico.onrender.com/ConsultorioOdontologico-1.0-SNAPSHOT/login.jsp

El usuario de prueba es:

##### Usuario: Admin
##### Login: 1234

 IMPORTANTE: al usarse un servidor de pruebas (Clever Cloud) se debe tener paciencia en cuanto a la carga de información ya que puede tener demoras.

## Front:
Se utiliza como base una plantilla confeccionada en Boostrap <a href="https://getbootstrap.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-plain-wordmark.svg" alt="bootstrap" width="30" height="30"/> </a>, la cuál se le da una estructura de componentes para las distintas páginas. Se utiliza JSP.

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
