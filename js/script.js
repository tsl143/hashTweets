var kayako = angular.module('kayako', ['ngSanitize']);

kayako.controller("mainCtrl", function($scope, $http, $sce) {
	$scope.hashTag = "custserv";
	$scope.$watch('hashTag', function(newValue, oldValue) { 
		$scope.loading = true;
		$scope.tweets = "";
		targetUri = "http://trishulgoel.com/twitter/?q="+$scope.hashTag;
		$http.jsonp(targetUri + "&callback=JSON_CALLBACK")
	    .success (function (data) {	    
	        console.log(data);
	        $scope.tweets = data.statuses;
	        window.localStorage.setItem('next_results',data.search_metadata.next_results);
	        $scope.loading = false;
	        if($scope.tweets.length<15){
	        	document.getElementById('loadMore').style.display="none";
	        }
	    })
	    .error (function (data) {
	    	console.log(data);
	    	//$scope.data = "Request failed!";
	    });
	}); 
	$scope.deliberatelyTrustDangerousSnippet = function(str) {
		return $sce.trustAsHtml(empowerHash(str));
	};
	$scope.setTag = function(str){
		$scope.hashTag = str;
		return;
	}
	$scope.giveMeMore = function(){
		$scope.loading = true;
		next_results = window.localStorage.getItem('next_results');
		targetUri = "http://trishulgoel.com/twitter"+next_results;
		$http.jsonp(targetUri + "&callback=JSON_CALLBACK")
	    .success (function (data) {	    
	        var moreTweets = data.statuses; 
	        $scope.tweets = $scope.tweets.concat(moreTweets);
	        window.localStorage.setItem('next_results',data.search_metadata.next_results);
	        $scope.loading = false;
	        if(moreTweets.length<15){
	        	document.getElementById('loadMore').style.display="none";
	        }
	    })
	    .error (function (data) {
	    	console.log(data);
	    	//$scope.data = "Request failed!";
	    });		
	}
});

kayako.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});

/*
kayako.filter( "empowerHash", function($sce) {
	return function( input ) {
		return String(input).replace(/#[^\s]*\ /g, function (s) {
      		return $sce.trustAsHtml("<a ng-click='hashTag="+s+"'>"+s+"</a>");
    	});
	}
});*/

function empowerHash(input){
		return String(input).replace(/#[^\s]*\ /g, function (s) {
			tagVal = s.substr(1);
      		return ("<a href=\"#\" ng-click=\"setTag('"+tagVal.substring(0, tagVal.length-1)+"')\">"+s+"</a>");
    	});	
}