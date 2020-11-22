const path = require('path');
const jsonServer = require('json-server');
const auth = require('json-server-auth')
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname,'db.json'));
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3002;

const rules = auth.rewriter({
    // Permission rules
    vrscans: 640,
    materials: 640,
    colors: 640,
    tags: 640,

    industries: 640,
    manufacturers: 640,

    //TODO:: lines commented for testing purposes
    // favorites: 660,
    // index:640
})

server.db = router.db;

server.use(middlewares);
server.use(rules)
server.use(auth);

server.get('/index', (req, res) => {
   const user = req.query.user;
   const scansLimit = req.query.vrscans_limit;

    const data = {
        'materials': server.db.get('materials'),
        'colors': server.db.get('colors'),
        'tags': server.db.get('tags')
    };

    if (scansLimit) {
        data.vrscans = server.db.get('vrscans').slice(0, scansLimit);
    }

    if (user) {
        data.favorites = server.db.get('favorites').filter(fav => fav.userId === parseInt(user));
    }

    res.jsonp(data);
})

server.use(router);

server.listen(port, "0.0.0.0", function () {
    console.log("Listening on Port 3002");
});
