const firebase = require('../config/firebase');

const showLoginForm = (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form method="POST" action="/auth/login">
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Contraseña" required>
            <button type="submit">Login</button>
        </form>
    `);
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await firebase.auth().signInWithEmailAndPassword(email, password);
        req.session.user = user;
        res.redirect('/dashboard');
    } catch (error) {
        res.status(401).send('Error de autenticación.');
    }
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

module.exports = {
    showLoginForm,
    login,
    logout
};
