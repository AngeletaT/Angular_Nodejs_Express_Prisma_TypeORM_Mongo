module.exports = (app) => {
        const categories = require('../controllers/category.controller.js');

        // CREATE CATEGORY
        app.post('/categories', categories.create);

        // GET ALL
        app.get('/categories', categories.findAll);

        // GET ONE
        app.get('/categories/:slug', categories.findOne);

        // DELETE ONE
        app.delete('/categories/:slug', categories.delete_category);

        // GET PRODUCTS BY CATEGORY
        app.get('/categories_select_filter', categories.findCategoriesSelect);

        // UPDATE
        // app.put('/productos/:id', products.update);

        // DELETE ALL
        // app.delete('/productos_all', products.deleteAll);
}