import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
            $or: [
                {
                    private: {
                        $ne: true
                    }
                },
                {
                    owner: this.userId
                }
            ]
        });
    });
}

Meteor.methods({
    'tasks.insert' (text) {
        check('text', String);

        // Only allow logged in users to insert
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert({
            text,
            createdAt: new Date(),
            checked: false,
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
    'tasks.remove' (taskId) {
        check(taskId, String);

        const task = Tasks.findOne(taskId);

        if (task.private && task.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.remove(taskId);
    },
    'tasks.setChecked' (taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        Tasks.update(taskId, {
            $set: {
                checked: setChecked
            }
        });
    },
    'tasks.setPrivate' (taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Tasks.findOne(taskId);

        // only owner can make task private
        if (task.private && task.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, {
            $set: {
                private: setToPrivate
            }
        });
    }
});
