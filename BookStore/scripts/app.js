var bookStoreApp = angular.module('bookStoreApp', []);

bookStoreApp.controller('headerCtrl', function headerCtrl ($scope){
    $scope.appDetails = {
        title: "The BookStore",
        tagLine: "Mais de 1 milhão de títulos para você"
    };
})

bookStoreApp.controller('bookListCtrl', function bookListCtrl ($scope, $http){   
    
    $scope.doSearch = function () {

        var termo = $scope.searchTerm;
        if (termo.lenght == 0) return;

        $scope.books = []

        $http({
            method: 'GET',
            url: 'https://www.googleapis.com/books/v1/volumes?q=' + termo + '&startIndex=0&maxResults=10',
        })
        .then(function successCallback(response) {
            $scope.items = response.data.items;
        }, function errorCallback(response) {
            alert("Error connecting to API");
        });
    
    }   
})

angular.module('bookStoreApp').filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
              //Also remove . and , so its gives a cleaner result.
              if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                lastspace = lastspace - 1;
              }
              value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});