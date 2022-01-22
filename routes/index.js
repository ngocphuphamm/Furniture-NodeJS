const siteRouter = require("./site");
const  productRouter = require("./product");
const categoriesRouter = require("./categories");
function route(app)
{
  app.use("/",siteRouter);
  app.use("/product",productRouter);
  app.use("/categories",categoriesRouter);
}

module.exports = route;