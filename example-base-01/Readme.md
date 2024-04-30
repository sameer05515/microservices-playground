# Example base 01
It contains folder structure as follows
```
example-base-01 ==base folder
|- backend = root for all backend services
|- frontend = root for frontend project. In this example we have single frontend project. It communicates with microservices,
|- nginx.conf = 
```

# docker compose with custom yml file
 ## to build
 ```
 docker-compose -f docker-compose-with-networks.yml build --no-cache
 ```
 ## to up
 ```
 docker-compose -f docker-compose-with-networks.yml up
 ```

# Frontend development
 ## To initialize a React.js project directly inside the "frontend" folder without creating any subfolders 
 ```
 npx create-react-app .
 ```

 This command will initialize a new React.js project directly in the "frontend" folder without creating any subfolders.