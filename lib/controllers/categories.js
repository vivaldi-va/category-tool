/**
 * Created by vivaldi on 20.3.2014.
 */

'use strict';

var q			= require('q');
var mysql		= require('mysql');
var log			= require('npmlog');
var dbConfig	= require('../config/dbConf.json');
var _			= require('underscore');
var db;

/**
 * Check the category name exists, used when
 * creating a new category or updating an existing one
 * for example
 *
 * @param {string} name name of the category
 * @returns {promise}
 * @private
 */
function _categoryNameExists(name) {
	var dfd = q.defer();

	db.getConnection(function(err, conn) {
		if(err) {
			log.warn('ERR', "DB::CONN::ERR", err);
			dfd.reject(err);
		}

		conn.query('SELECT id FROM categories WHERE name = \"' + name + '\"', function(err, result) {
			conn.release();
			if(err) {
				log.warn('ERR', "DB::QUERY::ERR", err);
				dfd.reject(err);
			}

			if(!result || result.length < 1) {
				dfd.resolve(false);
			} else {
				dfd.resolve(result[0].id);
			}

		});

	});
	return dfd.promise;
}


function _updateProductCategories(catId, productIdArr) {
	var dfd = q.defer();


	var productIdString = productIdArr.join();

	db.getConnection(function(err, conn) {
		if(err) {
			log.warn('ERR', "DB::ERR", err);
		} else {
			conn.query('UPDATE products SET categoryID=' + catId + ' WHERE id IN (' + productIdString + ');',
				function(err, result) {
					conn.release();
					if(err) {
						dfd.reject(err);
					} else {
						dfd.resolve(true);
					}
				});
		}
	});

	return dfd.promise;
}

function _findChildren(catId, data) {

	var catId		= parseInt(catId);
	var catIdArr	= [catId];

	function _checkIsFamily(elem) {
		var isFamily = false;

		if(parseInt(elem.parentID) !== 0) {
			if(elem.parentID === catId) {
				isFamily = true;

			} else {
				for(var i = 0; i < data.length; i++) {
					var qElem = data[i];

					//log.info('Rec', "Checking if element is family", elem.parentID === qElem.id);

					if(elem.parentID === qElem.id) {
						isFamily = _checkIsFamily(qElem);
					}
				}
			}
		}
		return isFamily;
	}



	var _buildArr = function() {

		for(var i = 0; i < data.length; i++) {
			var elem = data[i];
			log.info('FUNC', "Category", elem);
			if(elem.id === catId) continue;

			if(elem.parentID === catId) {
				catIdArr.push(elem.id);
			} else {

				if(_checkIsFamily(elem)) {
					catIdArr.push(elem.id);
				}
			}
		}

		log.info('FUNC', "Category IDs array", catIdArr);
	};

	_buildArr();
	return catIdArr;
}


exports.serv = function(pool) {
	db = pool;
};

exports.getCategoryList = function(req, res) {
	function _makeTree(data) {

		var tree = {"root": {"name": "root", "id": 0, children: []}};

		var _getParent = function(rootNode, rootId) {
			if(rootNode.id === rootId) {
				return rootNode;
			}

			for(var i = 0; i < rootNode.children.length; i++) {
				var child = rootNode.children[i];
				if(child.id === rootId) return child;

				if(child.children.length > 0) {
					var childResult = _getParent(child, rootId);
				}

				if(childResult != null) return childResult;
			}

			return null;
		};


		var _buildTree = function(tree) {
			for(var i = 0; i < data.length; i++) {
				var elem = data[i];

				//log.info('elem', elem);
				if(elem.name === "root") continue;


				elem["children"] = [];

				var rootId = elem.parentID;
				var parent = _getParent(tree.root, rootId);

				//log.info('parent', parent);
				if(!!parent) {
					parent.children.push(elem);
				}
			}
		};


		_buildTree(tree);
		//log.info('tree', tree);
		return tree;

	}

	db.getConnection(function(err, conn) {
		if(err) log.warn('ERR', "DB::ERR", err);

		conn.query('SELECT * FROM categories ORDER BY id', function(err, result) {
			conn.release();
			if(err) throw err;
			//res.send(result);
			res.send(_makeTree(result));

		});

	});
};

exports.createCategory = function(req, res) {
	var parent	= 0;
	var sql;

	req.assert('name', "Category name missing").notEmpty();
	if(!!req.body.parent) {
		req.assert('parent', "invalid parent category ID").isInt();
	}

	if(req.validationErrors()) {
		// TODO: decide whether to use status code for errors
		res.send(require('util').inspect(req.validationErrors()), 400);
	} else {


		// check whether the category exists or not
		_categoryNameExists(req.body.name)
			.then(
				function(success) {
					var dfd = q.defer();
					// return category ID if it exists already
					if(!!success) {
						dfd.resolve(success);
					} else {

						if(!!req.body.parent) parent = req.body.parent;

						sql = "INSERT INTO categories VALUES(NULL, \"" + req.body.name + "\", " + parent +")";

						log.info('SQL', sql);
						db.getConnection(function(err, conn) {
							if(err) log.warn('ERR', "DB::ERR", err);

							conn.query(sql, function(err, rows) {
								conn.release();
								if(err) throw err;

								log.info('DB', "Insert success, new ID:", rows.insertId);
								dfd.resolve(rows.insertId);
							});

						});
					}
					return dfd.promise;
				},
				function(err) {
					log.warn('ERR', "Category creation error", err);
				}
			)
			.then(function(catId) {
				if(catId) {
					log.info('CAT', "Category exists, so maybe use that to do stuff with instead", catId);

					if(req.body.products && req.body.products.length>0) {
						_updateProductCategories(catId, req.body.products)
							.then(
								function(result) {
									log.info('DB', "Updated products with new category ID");
									res.send(200);
								},
								function(err) {
									if(err) log.warn('ERR', "DB::QUERY::ERR", err);
									res.send(500);
								}
							);
					}
				} else {
					//log.info('CAT', "New category created, so do nothing");

					res.send(500);
				}
			});

	}


};

exports.removeCategory = function(req, res) {

	req.assert('id', "id must be a number").isInt();
	if(req.validationErrors()) {
		// TODO: decide whether to use status code for errors
		res.send(require('util').inspect(req.validationErrors()), 400);
	}

	// check if category has children
	var catId		= req.params.id;
	var catIdArr	= [catId];



	db.getConnection(function(err, conn) {
		if(err) {
			log.warn('ERR', "DB::CONN::ERR", err);
			throw err;
		}
		log.info('QUERY', "Finding categories that are children of category to be deleted");
		conn.query('SELECT id, parentID from categories', function(err, result) {
			if(err) {
				log.warn('ERR', "DB:QUERY::ERR", err);
				throw err;
			}

			catIdArr = _findChildren(catId, result);

			if(catIdArr) {
				catIdArr.join();
				log.info('QUERY', "Finding products whose ID matches ID's to be deleted");
				conn.query('SELECT * FROM products WHERE categoryID IN (' + catIdArr + ')',
					function(err, result) {
						conn.release();
						if(err) {
							log.warn('ERR', "DB:QUERY::ERR", err);
							throw err;
						}

						res.send(result, 200);
					});
			} else {
				res.send(500);
			}
		});
	});

	// create array of category selected for deletion, and all sub-categories
	// get parent category of cat to be deleted
	// update all products with cat ID of the target category, or any of it's deleted children, with the parent ID
};

exports.setCategoryName = function(req, res) {};

exports.setCategoryParent = function(req, res) {};


