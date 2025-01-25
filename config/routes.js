const userRoutes = require('../controllers/user');
const vehcileRoutes = require('../controllers/vehicle');
const depotRoutes = require('../controllers/depot');
const historyRoutes = require('../controllers/history');
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
    app.use('/api/vehicle', vehcileRoutes);
    app.use('/api/depot', depotRoutes);
    app.use('/api/history', historyRoutes);

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