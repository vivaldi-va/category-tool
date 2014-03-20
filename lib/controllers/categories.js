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

	function _selectCategories() {
		var dfd = q.defer();
		var sql = "SELECT * FROM categories";
		db.query(sql, function(err, result) {
			if (err) throw err;

			dfd.resolve(result);
		});

		return dfd.promise;
	}

	function _buildHeirarchy(data) {

		var formattedData = [];

		_.each(data, function(cat) {
			log.info('CAT', cat);


			if(cat.parentID===0) {
				var parent = cat;
				parent.children = [];
				parent.children=_.where(data, {"parentID": cat.id});

				formattedData.push(parent);
			}
			//log.info('CAT', parent);

		});
		//log.info('DATA', formattedData);
		return formattedData;
	}

	_selectCategories()
		.then(function(data) {
			res.send(_buildHeirarchy(data));
		});

};

exports.createCategory = function(req, res) {};

exports.setCategoryName = function(req, res) {};

exports.setCategoryParent = function(req, res) {};


