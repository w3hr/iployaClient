/*
	*	iploya - easy deployer (iployaClient)
	*	author: Ludwig Oberheuser<oberheuser@gmail.com>
	*	created: 19.06.2018
	*
	*	(c) 2018 Ludwig Oberheuser
	*	License: MIT
	*/

var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {

    $scope.plugins = [];
    $scope.todos = { Version: "iploya 00.05a", Commands: {} };
    $scope.placeholder = [];

    $scope.SetVariablesTmp = {};

    $scope.SourceTodos = function () {
        $scope.todos = JSON.parse(angular.element(document.getElementById('Source')).val());
    }

    $scope.TodoToJson = function () {
        angular.element(document.getElementById('Source')).val(JSON.stringify($scope.todos, null, 2));
    }

    $http.get("./api/pluginsinfo.json")
        .then(function (response) {
            $scope.plugins = response.data;
        });

    $http.get("./api/placeholder.json")
        .then(function (response) {
            $scope.placeholder = response.data;
        });

    $scope.ParseSource = function () {
        let src = angular.element('#Source').val();
        $scope.todos = JSON.parse(src);
    }

    $scope.ShowPrompt = function (header, text, func) {
        UIkit.modal.prompt(header, text).then(function (val) {
            func(val);
        });
    }

    $scope.GetInputByAction = function (action) {
        return $scope.plugins[action].Inputs;
    }

    $scope.GetInputReactionsById = function (id) {
        console.log(id);
        console.warn($scope.todos);
        return $scope.todos.Commands[id].On;
    }

    $scope.GetCurrentValueByKey = function (willkey, index) {
        let ret = '';
        angular.forEach($scope.todos.Commands, function (value, key) {
            if (key === willkey) {
                ret = value.Arguments[index];
            }
        });
        return ret;
    }

    $scope.RemoveId_OnClick = function (id) {
        UIkit.modal.confirm('Are you sure to remove Step <strong>' + id + '</strong> ?').then(function () {
            $scope.RemoveId(id);
        }, function () { });
    }

    $scope.RemoveId = function (id) {
        delete $scope.todos.Commands[id];
        $scope.$apply();
    }

    $scope.UpdateSource = function () {
        console.log('ja');
        document.getElementById('Source').value('test');
    }

    $scope.CreateNewCommand = function (commandId) {

        if (typeof $scope.plugins === 'undefined' || $scope.plugins.length === 0)
            return $scope.Alert('no plugins loaded');

        if (typeof $scope.plugins[commandId] === 'undefined')
            return $scope.Alert('plugin with id ' + commandId + ' has no plugin description.');

        let newObject = {
            Action: commandId, Arguments: [], SetVariable: [], On: { 0: "next" }
        };

        let rnd = $scope.GetNextStepId();

        $scope.todos.Commands[rnd] = newObject;

        if (typeof $scope.plugins[commandId].Inputs !== 'undefined')
            angular.forEach($scope.plugins[commandId].Inputs, function (value, key) {
                if (typeof value.DefaultValue !== 'undefined')
                    newObject.Arguments.push(value.DefaultValue);
            });

        $scope.TodoToJson();
    }

    $scope.AddSetVariable = function (id) {

        if (typeof $scope.SetVariablesTmp[id + '-key'] === 'undefined' || typeof $scope.SetVariablesTmp[id + '-value'] === 'undefined')
            return;

        if ($scope.SetVariablesTmp[id + '-key'] === '')
            return $scope.Alert('please enter a setvalue key.');


        if ($scope.SetVariablesTmp[id + '-value'] === '')
            return $scope.Alert('please enter a setvalue value.');

        let key = $scope.SetVariablesTmp[id + '-key'];
        let val = $scope.SetVariablesTmp[id + '-value'];

        $scope.todos.Commands[id].SetVariable.push([key, val]);

        console.log($scope.todos.Commands);

        $scope.SetVariablesTmp[id + '-key'] = '';
        $scope.SetVariablesTmp[id + '-value'] = '';
    }

    $scope.RemoveSetVariable = function (id, key) {
        let old = [];
        for (let i = 0; i < $scope.todos.Commands[id].SetVariable.length; i++) {
            console.log($scope.todos.Commands[id].SetVariable[i]);
            if ($scope.todos.Commands[id].SetVariable[i][0] !== key)
                old.push($scope.todos.Commands[id].SetVariable[i]);
        }
        $scope.todos.Commands[id].SetVariable = old;
    }

    $scope.GetNextStepId = function () {
        let rnd = $scope.GenerateRandomString();
        if (typeof $scope.todos[rnd] !== 'undefined')
            return $scope.GetNextStepId();
        return rnd;
    }

    $scope.GenerateRandomString = function (rnd_length = 5) {
        let p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let rnd = "";
        for (var i = 0; i < rnd_length; i++)
            rnd += p.charAt(Math.floor(Math.random() * p.length));
        return rnd;
    }

    $scope.Alert = function (msg) {
        UIkit.modal.alert(msg);
    }

    $scope.AddNewRection = function (event, where) {
        if (event.key !== 'Enter')
            return;

        let v = event.target.value;

        if (typeof where[v] !== 'undefined')
            return $scope.Alert('already a recation defined');
        where[v] = 'next';
        event.target.value = '';
    }

});

angular.module('myApp')
    .directive('compile', ['$compile', function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            );
        };
    }]);