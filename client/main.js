import angular from 'angular';
import angularMeteor from 'angular-meteor';
import todosList from '../imports/index.js';
import '../imports/startup/accounts-config.js';

angular.module('simple-todos', [
  angularMeteor,
  todosList.name,
  'accounts.ui'
]);
