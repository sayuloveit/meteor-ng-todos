import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Tasks } from '../../api/tasks.js';

import template from './todosList.html';

export class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.subscribe('tasks');

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
    Meteor.call('tasks.insert', newTask);

    // Clear form
    this.newTask = '';
  }

  setChecked(task) {
      // Toogle the checked property value
      Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

  removeTask(task) {
      Meteor.call('tasks.remove', task._id);
  }

  setPrivate(task) {
      Meteor.call('tasks.setPrivate', task._id, !task.private);
  }

}
