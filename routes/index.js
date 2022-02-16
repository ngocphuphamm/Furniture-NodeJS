const siteRouter = require("./site");
const  productRouter = require("./product");
const categoriesRouter = require("./categories");
const adminRouter =  require("./admin");
function route(app)
{
  app.use("/",siteRouter);
  app.use("/product",productRouter);
  app.use("/categories",categoriesRouter);
  app.use("/admin",adminRouter);
}

module.exports = route;