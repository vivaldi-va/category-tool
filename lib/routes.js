'use strict';
console.log("ROUTER");
var api = require('./controllers/api');
var index = require('./controllers');
var products = require('./controllers/products');
var categories = require('./controllers/categories');

/**
 * Application routes
 */
module.exports = function (app) {

	// Server API Routes

	// Products
	app.get('/api/products/search/:query', products.searchProducts);

	// Categories
	app.get('/api/categories', categories.getCategoryList);
	app.post('/api/categories', categories.createCategory);
	app.delete('/api/categories/:id', categories.removeCategory);
	app.get('/api/categories/remove/:id', categories.removeCategory);
	app.put('/api/categories/:id/:newParentId', categories.setCategoryParent);
	app.post('/api/categories/:id', categories.setCategoryName);

	// Brands

	// All undefined api routes should return a 404
	app.get('/api/*', function (req, res) {
		res.send(404);
	});

	// All other routes to use Angular routing in app/scripts/app.js
	app.get('/partials/*', index.partials);
	app.get('/*', index.index);
};