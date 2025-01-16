const userRoutes = require('../controllers/user');
const auth = require('../components/middleware/authMiddleware');

/**
 * Expose routes
 */
module.exports = (app) => {
    /*
    * Only insert require to module folder
    * Routes should be defined in module folder
    */
    app.use('/api/user', userRoutes);
    // app.use('/api/vehicle', userRoutes);

    /**
   * Validation errors
   */
    app.use((err, req, res, next) => {
        if (err.stack.includes('ValidationError')) {
            res.status(422).json({ errors: err.errors });
            return;
        }

        next(err);
    });

    /**
     * Error handling -- Development
     */
    if (process.env.NODE_ENV === 'development') {
        app.use((err, req, res, next) => {
            console.error(err.stack);
            next(err);
        });
    }
}