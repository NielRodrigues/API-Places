import { Router } from "express";

import login from "./apps/controllers/LoginController"
import user from "./apps/controllers/UserController"
import place from "./apps/controllers/PlaceController"

const routes = new Router();

// Login
routes.post("/login", login.create);

// Register
routes.post("/register", user.create);

// A partir daqui, para acessar as rotas irá precisar de um token de acesso

// Users
routes.get("/users", user.index);
routes.get("/users/:id", user.show);
routes.put("/users/:id", user.update);
routes.delete("/users/:id", user.delete);

// Lugares
routes.get("/places", place.index);
routes.get("/places/:id", place.show);
routes.post("/places", place.create);
routes.put("/places/:id", place.update);
routes.delete("/places/:id", place.delete);

export default routes;