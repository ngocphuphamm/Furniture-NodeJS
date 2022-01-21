class siteController{
    home(req,res,next)
    {
        res.send("hello");
    }
}
module.exports= new siteController ();