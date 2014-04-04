/**
 * Created by vivaldi on 2.4.2014.
 */

var log			= require('npmlog');
var mysql		= require('mysql');
var dbConf		= require('./dbConf.json');
var categories	= require('../controllers/categories');
var products	= require('../controllers/products');
var pool		= mysql.createPool(dbConf);

if(pool) log.info('DB', "Pool creation successful");

module.exports = function() {
	categories.serv(pool);
	products.serv(pool);
};