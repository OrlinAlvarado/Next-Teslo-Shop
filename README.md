# Next.js Teslo Shop

Para correr localmente se ncesita la base de datos

```
docker-compose up -d
```

* El -d, significa __detached__


* MongoDB URL Local

```
mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno

Renombrar el archivo __.env.template__ a __.env__

* Reconstruir los modulos de Node y levantar aplicacion
```
yarn install 
yarn dev
```




## Llenar la base de datos con informacion de pruebas

```
http://127.0.0.1:3000/api/seed
```