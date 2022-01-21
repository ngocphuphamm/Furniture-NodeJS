class siteController{
    home(req,res,next)
    {
        res.render("index");
    }
}
module.exports= new siteController ();