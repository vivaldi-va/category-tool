/**
 * Created by vivaldi on 20.3.2014.
 */

'use strict';

var q			= require('q');
var mysql		= require('mysql');
var log			= require('npmlog');
var dbConfig	= require('../config/dbConf.json');
var _			= require('underscore');


exports.getCategoryList = function(req, res) {

	var db = mysql.createConnection(dbConfig);

	/*function _selectCategories() {
		var dfd = q.defer();
		var sql = "SELECT node.id, node.name, (COUNT(parent.name) - 1) AS depth " +
			"FROM nested_categories AS parent, " +
			"nested_categories AS node " +
			"WHERE node.lft BETWEEN parent.lft " +
			"AND parent.rgt " +
			"GROUP BY node.name " +
			"ORDER BY node.lft;";
		db.query(sql, function(err, result) {
			if (err) throw err;

			log.info('DB', result);
			dfd.resolve(result);
		});

		return dfd.promise;
	}

	_selectCategories()
		.then(function(data) {
			db.end(function(err) {
				if(err) throw err;
			});
			res.send(data);
		});
*/

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

				log.info('elem', elem);
				if(elem.name === "root") continue;


				elem["children"] = [];

				var rootId = elem.parentID;
				var parent = _getParent(tree.root, rootId);

				log.info('parent', parent);
				if(!!parent) {
					parent.children.push(elem);
				}
			}
		};


		_buildTree(tree);
		log.info('tree', tree);
		return tree;

	}

	db.query('SELECT * FROM categories ORDER BY id', function(err, result) {
		if(err) throw err;
		//res.send(result);
		res.send(_makeTree(result));

	});
};

exports.createCategory = function(req, res) {
	var db 	= mysql.createConnection(dbConfig);
	var sql;

	req.assert('name', "Category name missing").notEmpty();
	if(!!req.body.parent) {
		req.assert('parent', "invalid parent category ID").isInt();
	}

	if(req.validationErrors()) {
		res.send(require('util').inspect(req.validationErrors()), 400);
	} else {
		//db.connect();

		if(!!req.body.parent) {
			sql	= "LOCK table nested_categories WRITE; " +
				"SELECT @myLeft := lft FROM nested_categories WHERE id = " + req.body.parent +";" +
				"UPDATE nested_categories SET rgt = rgt + 2 WHERE rgt > @myLeft; " +
				"UPDATE nested_categories SET lft = lft + 2 WHERE lft > @myLeft; " +
				"INSERT into nested_categories(name, lft, rgt) VALUES ('" + req.body.name + "', @myleft + 1, @myLeft + 2);" +
				"UNLOCK tables;";
		} else {
			sql = "LOCK table nested_categories WRITE; " +
				"SELECT @myLeft := lft FROM nested_categories WHERE name = 'food'; " +
				"UPDATE nested_categories SET rgt = rgt + 2 WHERE rgt > @myLeft; " +
				"UPDATE nested_categories SET lft = lft + 2 WHERE lft > @myLeft; " +
				"INSERT INTO nested_categories(name, lft, rgt) VALUES ('" + req.body.name + "', @myleft + 1, @myLeft + 2); " +
				"UNLOCK tables;";
		}

		log.info('SQL', sql);
		db.query(sql, function(err, rows) {
				if(err) throw err;

				log.info('DB', "Insert success, new ID:", rows.insertId);
				res.send(200);
			});
	}


};

exports.setCategoryName = function(req, res) {};

exports.setCategoryParent = function(req, res) {};


