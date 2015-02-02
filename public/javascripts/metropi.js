var metropi = angular.module('metropi', []);
//$scope.medir(5);
//console.log($scope);

metropi.controller('lecturasCtrl', function ($scope,$http) {
    $scope.medida=0;
    $scope.estilo='';
    $scope.calibrar=function(){
        $http.get('mpi/cal').error(function(data, status, headers, config) {
            console.log(data);
        }).success(function(data, status, headers, config) {
            //console.log(data);
            if(data.power){
                $scope.refresca();
            }
        });
    }
    $scope.medir=function(tam){
        $scope.medida=tam;
        $scope.estilo="transition: none;width: " + $scope.medida + "%";
    }
    $scope.refresca=function(){
        $http.get('mpi/med').error(function(data, status, headers, config) {
            console.log(data);
        }).success(function(data, status, headers, config) {
            $scope.medir(data.med);
            if(data.power){
                $scope.refresca();
            }
        })
    }
    $scope.refresca();
    $scope.marcha=function(){
        $http.get('mpi/on').error(function(data, status, headers, config) {
            console.log(data);
        }).success(function(data, status, headers, config) {
                //console.log(data);
                if(data.power){
                    $scope.refresca();
                }
        });
    }
    $scope.paro=function(){
        $http.get('mpi/off').error(function(data, status, headers, config) {
            console.log(data);
        }).success(function(data, status, headers, config) {
                //console.log(data);
                if(data.power){
                    $scope.refresca();
                }
        });
    }
    $scope.reinicia=function(){
        $http.get('mpi/reset').error(function(data, status, headers, config) {
            console.log(data);
        }).success(function(data, status, headers, config) {
            //console.log(data);
            if(data.power){
                $scope.refresca();
            }
        });
    }
    $scope.apaga=function(){
        $http.get('mpi/halt').error(function(data, status, headers, config) {
            console.log(data);
        }).success(function(data, status, headers, config) {
            //console.log(data);
            if(data.power){
                $scope.refresca();
            }
        });
    }
    $scope.cierraprograma=function(){
        $http.get('mpi/close').error(function(data, status, headers, config) {
            console.log(data);
        }).success(function(data, status, headers, config) {
            //console.log(data);
            if(data.power){
                $scope.refresca();
            }
        });
    }
});
