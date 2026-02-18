import { Hono } from "hono";
import authorRouter from "./endpoints/authors.js";
import bookRouter from "./endpoints/books.js";

const apiRouter = new Hono();

apiRouter.route("/books", bookRouter);
apiRouter.route("/authors", authorRouter);

export default apiRouter;
