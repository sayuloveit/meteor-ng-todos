import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { TodosListCtrl } from './components/todosList/todosList'

export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl],
    controllerAs: 'taskCtrl'
  });
