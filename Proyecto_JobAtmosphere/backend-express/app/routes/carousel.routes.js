module.exports = (app) => {
    const carousel = require('../controllers/carousel.controller');

    // Categoria
    app.get('/carousel', carousel.get_carousel_category);
    
    // Job
    app.get('/carousel/:slug', carousel.get_carousel_job);

}
