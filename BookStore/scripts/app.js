var bookStoreApp = angular.module('bookStoreApp', ["ngRoute", "ngAnimate"]);

bookStoreApp.config(['$routeProvider',
function ($routeProvider){
    $routeProvider
    .when("/books", {
        templateUrl: "partials/book-list.html",
        controller: "bookListCtrl"
    })
    .when("/cart", {
        templateUrl: "partials/cart-list.html",
        controller: "cartListCtrl"
    })
    .otherwise( "/books")
}]);

bookStoreApp.factory("bookService", function($http){
    return{
        getBooks: function(termo){            

            return $http({
                method: 'GET',
                url: 'https://www.googleapis.com/books/v1/volumes?q=' + termo + '&startIndex=0&maxResults=10',
            })        
        }
    }
});

bookStoreApp.factory("cartService", function(){
    var cart = [];

    return{
        getCart: function(){
            return cart;
        },

        addToCart: function(book){
            cart.push(book);
        },

        buy: function(book){
            alert("Obrigado por comprar ", book.volumeInfo.title);
        }
    }
});

bookStoreApp.controller('headerCtrl', function headerCtrl ($scope, $location){
    $scope.appDetails = {
        title: "The BookStore",
        tagLine: "Mais de 1 milhão de títulos para você"
    };

    $scope.nav = {};

    $scope.nav.isActive = function(path){        
            return path === $location.path();        
    }

})

bookStoreApp.controller('cartListCtrl', function cartListCtrl ($scope, cartService){
    $scope.cart = cartService.getCart();

    $scope.buy = function(book){
        cartService.buy(book);
    }
})


bookStoreApp.controller('bookListCtrl', function bookListCtrl ($scope, $http, bookService, cartService){   
    
    $scope.doSearch = function () {

        var termo = $scope.searchTerm;       

        var handleSuccess = function(response) {
            $scope.items = response.data.items;
        };

        bookService.getBooks(termo).then(handleSuccess)

        $scope.searchTerm = termo;
    }
    
    $scope.addToCart = function(book){
        cartService.addToCart(book);
    }
})

bookStoreApp.filter('cut', function () {
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