angular.module('zikerCeoApp').controller('loginController',function($scope,$http){
  $scope.title = 'hello java';

  $http.get('/user/gettest?name=wang').then(function(data){
    $scope.data = data;
  })

})