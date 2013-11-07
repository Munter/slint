var assert = require('chai').assert,
    Path = require('path'),
    fs = require('fs'),
    npmPackages = require('../../lib/linters/npm-packages');

/*global describe, it*/

describe('npm-packages', function () {
    describe('in a project with an installed package listed under optionalDependencies', function () {
        var projectDirectory = Path.resolve(__dirname, 'npm-packages', 'optionalDependencies'),
            packageJsonPath = Path.resolve(projectDirectory, 'package.json'),
            packageJsonStr;

        before(function (done) {
            fs.readFile(packageJsonPath, 'utf-8', function (err, contents) {
                packageJsonStr = contents;
                done(err);
            });
        });
        it('should output zero errors', function (done) {
            npmPackages(packageJsonPath, packageJsonStr, {}, function (err, results) {
                assert.isArray(results);
                assert.equal(results.length, 0);
                done(err);
            });
        });
    });

    describe('in a project with no dependencies listed in package.json and no node_modules folder', function () {
        var projectDirectory = Path.resolve(__dirname, 'npm-packages', 'noDependenciesAndNoNodeModules'),
            packageJsonPath = Path.resolve(projectDirectory, 'package.json'),
            packageJsonStr;

        before(function (done) {
            fs.readFile(packageJsonPath, 'utf-8', function (err, contents) {
                packageJsonStr = contents;
                done(err);
            });
        });
        it('should output zero errors', function (done) {
            npmPackages(packageJsonPath, packageJsonStr, {}, function (err, results) {
                assert.isArray(results);
                assert.equal(results.length, 0);
                done(err);
            });
        });
    });

    describe('in a project with a package.json that has a dependencies property with a string value', function () {
        var projectDirectory = Path.resolve(__dirname, 'npm-packages', 'nonObjectDependencies'),
            packageJsonPath = Path.resolve(projectDirectory, 'package.json'),
            packageJsonStr;

        before(function (done) {
            fs.readFile(packageJsonPath, 'utf-8', function (err, contents) {
                packageJsonStr = contents;
                done(err);
            });
        });
        it('should output one error', function (done) {
            npmPackages(packageJsonPath, packageJsonStr, {}, function (err, results) {
                assert.isArray(results);
                assert.equal(results.length, 1);
                assert.equal(results[0].message, 'The dependencies property should be an object if present');
                done(err);
            });
        });
    });

    describe('in a project with a package.json that has the same package listed under dependencies and devDependencies', function () {
        var projectDirectory = Path.resolve(__dirname, 'npm-packages', 'sameDependencyListedTwice'),
            packageJsonPath = Path.resolve(projectDirectory, 'package.json'),
            packageJsonStr;

        before(function (done) {
            fs.readFile(packageJsonPath, 'utf-8', function (err, contents) {
                packageJsonStr = contents;
                done(err);
            });
        });
        it('should output two errors', function (done) {
            npmPackages(packageJsonPath, packageJsonStr, {}, function (err, results) {
                assert.isArray(results);
                assert.equal(results.length, 2);
                assert.equal(results[0].message, 'devDependencies: The package a was already listed in the dependencies section, and with a different version specifier (1.2.3 vs. 1.4.7)');
                assert.equal(results[1].message, 'optionalDependencies: The package b was already listed in the dependencies section');
                done(err);
            });
        });
    });

    describe('in a project with a dependency that is not installed in node_modules', function () {
        var projectDirectory = Path.resolve(__dirname, 'npm-packages', 'dependencyNotInstalled'),
            packageJsonPath = Path.resolve(projectDirectory, 'package.json'),
            packageJsonStr;

        before(function (done) {
            fs.readFile(packageJsonPath, 'utf-8', function (err, contents) {
                packageJsonStr = contents;
                done(err);
            });
        });
        it('should output one error', function (done) {
            npmPackages(packageJsonPath, packageJsonStr, {}, function (err, results) {
                assert.isArray(results);
                assert.equal(results.length, 1);
                assert.equal(results[0].message, 'Package b is not installed (expected version: 2.0.0).');
                done(err);
            });
        });
    });

    describe('in a project with an optional dependency that is not installed in node_modules', function () {
        var projectDirectory = Path.resolve(__dirname, 'npm-packages', 'optionalDependencyNotInstalled'),
            packageJsonPath = Path.resolve(projectDirectory, 'package.json'),
            packageJsonStr;

        before(function (done) {
            fs.readFile(packageJsonPath, 'utf-8', function (err, contents) {
                packageJsonStr = contents;
                done(err);
            });
        });
        it('should output zero errors', function (done) {
            npmPackages(packageJsonPath, packageJsonStr, {}, function (err, results) {
                assert.isArray(results);
                assert.equal(results.length, 0);
                done(err);
            });
        });
    });
});
