module.exports = (app, passport) => {
    app.get('/', (req, res) => {console.log(req); res.render('login');})
};