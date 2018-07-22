/*
	*	iploya - easy deployer (iployaClient)
	*	author: Ludwig Oberheuser<oberheuser@gmail.com>
	*	created: 19.06.2018
	*
	*	(c) 2018 Ludwig Oberheuser
	*	License: MIT
	*/

var app = angular.module("myApp", []);
app.controller("myCtrl", function (a, f) {
a.plugins = []; a.todos = { Version: "iploya 00.05a", Commands: {} }; a.placeholder = []; a.SetVariablesTmp = {}; a.SourceTodos = function () { a.todos = JSON.parse(angular.element(document.getElementById("Source")).val()) }; a.TodoToJson = function () { angular.element(document.getElementById("Source")).val(JSON.stringify(a.todos, null, 2)) }; f.get("./api/pluginsinfo.json").then(function (b) { a.plugins = b.data }); f.get("./api/placeholder.json").then(function (b) { a.placeholder = b.data }); a.ParseSource =
    function () { var b = angular.element("#Source").val(); a.todos = JSON.parse(b) }; a.ShowPrompt = function (a, d, c) { UIkit.modal.prompt(a, d).then(function (a) { c(a) }) }; a.GetInputByAction = function (b) { return a.plugins[b].Inputs }; a.GetInputReactionsById = function (b) { console.log(b); console.warn(a.todos); return a.todos.Commands[b].On }; a.GetCurrentValueByKey = function (b, d) { var c = ""; angular.forEach(a.todos.Commands, function (a, f) { f === b && (c = a.Arguments[d]) }); return c }; a.RemoveId_OnClick = function (b) {
        UIkit.modal.confirm("Are you sure to remove Step <strong>" +
            b + "</strong> ?").then(function () { a.RemoveId(b) }, function () { })
    }; a.RemoveId = function (b) { delete a.todos.Commands[b]; a.$apply() }; a.UpdateSource = function () { console.log("ja"); document.getElementById("Source").value("test") }; a.CreateNewCommand = function (b) {
        if ("undefined" === typeof a.plugins || 0 === a.plugins.length) return a.Alert("no plugins loaded"); if ("undefined" === typeof a.plugins[b]) return a.Alert("plugin with id " + b + " has no plugin description."); var d = { Action: b, Arguments: [], SetVariable: [], On: { 0: "next" } },
            c = a.GetNextStepId(); a.todos.Commands[c] = d; "undefined" !== typeof a.plugins[b].Inputs && angular.forEach(a.plugins[b].Inputs, function (a, b) { "undefined" !== typeof a.DefaultValue && d.Arguments.push(a.DefaultValue) }); a.TodoToJson()
    }; a.AddSetVariable = function (b) {
        if ("undefined" !== typeof a.SetVariablesTmp[b + "-key"] && "undefined" !== typeof a.SetVariablesTmp[b + "-value"]) {
            if ("" === a.SetVariablesTmp[b + "-key"]) return a.Alert("please enter a setvalue key."); if ("" === a.SetVariablesTmp[b + "-value"]) return a.Alert("please enter a setvalue value.");
            a.todos.Commands[b].SetVariable.push([a.SetVariablesTmp[b + "-key"], a.SetVariablesTmp[b + "-value"]]); console.log(a.todos.Commands); a.SetVariablesTmp[b + "-key"] = ""; a.SetVariablesTmp[b + "-value"] = ""
        }
    }; a.RemoveSetVariable = function (b, d) { for (var c = [], e = 0; e < a.todos.Commands[b].SetVariable.length; e++)console.log(a.todos.Commands[b].SetVariable[e]), a.todos.Commands[b].SetVariable[e][0] !== d && c.push(a.todos.Commands[b].SetVariable[e]); a.todos.Commands[b].SetVariable = c }; a.GetNextStepId = function () {
        var b = a.GenerateRandomString();
        return "undefined" !== typeof a.todos[b] ? a.GetNextStepId() : b
    }; a.GenerateRandomString = function (a) { a = void 0 === a ? 5 : a; for (var b = "", c = 0; c < a; c++)b += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random())); return b }; a.Alert = function (a) { UIkit.modal.alert(a) }; a.AddNewRection = function (b, d) { if ("Enter" === b.key) { var c = b.target.value; if ("undefined" !== typeof d[c]) return a.Alert("already a recation defined"); d[c] = "next"; b.target.value = "" } }
});