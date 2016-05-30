import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Tasks } from '../../api/tasks.js';

import template from './todosList.html';

class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.hideCompleted = false;

    this.helpers({
        tasks() {
            const selector = {};

            // If hide completed is checked, filter tasks
            if (this.getReactively('hideCompleted')) {
              selector.checked = {
                $ne: true
              };
            }

            return Tasks.find(selector, {
                sort: {
                    createdAt: -1
                }
            });
        },
        incompleteCount() {
            return Tasks.find({
                checked: {
                    $ne: true
                }
            }).count()
        },
        currentUser() {
            return Meteor.user();
        }
    })
  }

  addTask(newTask) {
    // Insert a taks into the Collection
    Tasks.insert({
        text: newTask,
        createdAt: new Date(),
        checked: false,
        owner: Meteor.userId(),
        username: Meteor.user().username
    })

    // Clear form
    this.newTask = '';
  }

  setChecked(task) {
      // Toogle the checked property value
      Tasks.update(task._id, {
          $set: {
              checked: !task.checked
          }
      })
  }

  removeTask(task) {
      Tasks.remove(task._id)
  }

}

export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl],
    controllerAs: 'taskCtrl'
  });
