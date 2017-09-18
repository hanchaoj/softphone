angular.module('zikerCeoApp', [
    'ui.router'
  ])
  .value('backendURL', '/backend')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  })
  .run(function ($rootScope, $state) {
    console.log('run')
  });
