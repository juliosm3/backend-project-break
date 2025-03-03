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
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        req.session.user = { uid: userCredential.user.uid, email: userCredential.user.email };
        res.redirect('/dashboard');
    } catch (error) {
        res.status(401).send('<h1>Error de autenticación. Verifica tus credenciales.</h1>');
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
