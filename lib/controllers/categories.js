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

		if(!!req.body.parent) parent = req.body.parent;

		sql = "INSERT INTO categories VALUES(NULL, \"" + req.body.name + "\", " + parent +")";

		log.info('SQL', sql);
		db.getConnection(function(err, conn) {
			if(err) log.warn('ERR', "DB::ERR", err);

			conn.query(sql, function(err, rows) {
				if(err) throw err;

				log.info('DB', "Insert success, new ID:", rows.insertId);
				res.send(200);
			});

		});
	}


};

exports.removeCategory = function(req, res) {};

exports.setCategoryName = function(req, res) {};

exports.setCategoryParent = function(req, res) {};


