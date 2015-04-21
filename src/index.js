'use strict';

exports.TeamCityLogger = require('./js/team-city-logger');
exports.templateUtils = require('./js/template-utils');

exports.files = [];

exports.fileSummary = {
  errors: 0,
  warnings: 0,
  clean: 0,
  total: 0
};

exports.alertSummary = {
  errors: 0,
  warnings: 0,
  total: 0
};

exports.errorOccurances = [];
exports.warningOccurances = [];

/**
 * Updates file summary
 * @param {object} file - File data
 * @returns {void}
 */
exports.updateFileSummary = function(file) {
  if (file.errors) {
    this.fileSummary.errors++;
  } else if (file.warnings) {
    this.fileSummary.warnings++;
  } else {
    this.fileSummary.clean++;
  }

  this.fileSummary.total++;

  this.files.push(file);
};


/**
 * Updates number of alerts
 * @param {object} alert - A single message that is either an error or a warning
 * @returns {void}
 */
this.updateAlertSummary = function(alert) {
  if (alert.severity === 'error' || alert.severity === 2) {
    this.alertSummary.errors++;
  } else if (alert.severity === 'warning' || alert.severity === 1) {
    this.alertSummary.warnings++;
  }

  this.alertSummary.total = this.alertSummary.errors + this.alertSummary.warnings;
};


/**
 * Sort files so the ones with the most errors are at the top
 * @param {object} a - Object to compare to b
 * @param {object} b - Object to compare to a
 * @returns {int} - Value used to sort the list of files
 */
exports.sortErrors = function(a, b) {
  if (b.errors === 0 && a.errors === 0) {
    if (b.warnings === 0 && a.warnings === 0) {
      if (a.path < b.path) {
        return -1;
      } else if (a.path > b.path) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return (b.warnings - a.warnings);
    }
  } else {
    if (b.errors === a.errors) {
      return (b.warnings - a.warnings);
    } else {
      return (b.errors - a.errors);
    }
  }
};


/**
 * Helper for sorting occurances
 * @param {object} a - First object to compare
 * @param {object} b - Second object to compare
 * @returns {int} - Value used to sort the occurances
 */
exports.sortOccurances = function(a, b) {
  return b.count - a.count;
};


/**
 * Count the occurances of an alert
 * @param {string} key - Linting rule
 * @param {array} severity - Array of occurances
 * @param {string|boolean} ruleUrl - URL of rule for reference
 * @returns {void}
 */
exports.updateOccurance = function(key, severity, ruleUrl) {
  var foundOccurance = false;

  var occurances = (severity === 'error' || severity === 2)
                      ? this.errorOccurances : this.warningOccurances;

  for (var x = 0; x < occurances.length; x++) {
    if (occurances[x].name === key) {
      foundOccurance = true;
      occurances[x].count++;
    }
  }

  if (!foundOccurance) {
    occurances.push({ name: key, count: 1, ruleUrl: ruleUrl});
  }
};
