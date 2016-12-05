module.exports = (app, passport) => {
    app.get('/', (req, res) => res.render('login'));
};