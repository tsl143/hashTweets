/*
		
	kayako - the angular module

	mainCtrl $scope variables
		hashTag - current hashtag to be searched
		loading - toggle between load more button and waiting
		tweets  - the set of filtered tweets

	mainCtrl $scope functions
		populateTweets	-	loads all the tweets into tweets variable
		treatHTML		-	this ensures all hashtags in string are made clickable using empowerHash function
		setTag			-	responds to click on any hashtag, sets scope variable and calls scope function
		giveMeMore		-	gets the next result url from localstorage and gets the next set of tweets
		
*/	
var kayako = angular.module('kayako', ['ngSanitize']);

kayako.controller("mainCtrl", function($scope, $http, $sce, $timeout) {

	$scope.hashTag = "custserv";

	$scope.populateTweets = function(){
		$scope.loading = true;
		$scope.tweets = "";
		var targetUri = "http://trishulgoel.com/twitter/?q="+$scope.hashTag.replace(/[^a-zA-Z ]/g, "")+' min_retweets:1';
		$http.jsonp(targetUri + "&callback=JSON_CALLBACK")
		.success (function (data) {	    
			if(data.statuses){
		        $scope.tweets = data.statuses;
		        //storing the pagination url locally
		        window.localStorage.setItem('next_results',data.search_metadata.next_results);
		        
		        if($scope.tweets.length<15){
		        	document.getElementById('loadMore').style.display="none";
		        }else{
		        	document.getElementById('loadMore').style.display="block";
		        }
		        $scope.loading = false;
		    }
	    })
	    .error (function (data) {
	    	console.log(data);
	    	alert('Something went wrong');	    	
	    });		
	}
	
	$scope.treatHTML = function(str) {
		return $sce.trustAsHtml(empowerHash(str));
	};

	$scope.setTag = function(str){
		$scope.hashTag = str;
		$scope.populateTweets();
		return;
	}

	$scope.giveMeMore = function(){
		$scope.loading = true;

		//getting the pagination url from localStorage
		var next_results = window.localStorage.getItem('next_results');
		var targetUri = "http://trishulgoel.com/twitter"+next_results;
		$http.jsonp(targetUri + "&callback=JSON_CALLBACK")
	    .success (function (data) {	
	    	if(data.statuses){
	    		var moreTweets = data.statuses; 
		        $scope.tweets = $scope.tweets.concat(moreTweets);
		        window.localStorage.setItem('next_results',data.search_metadata.next_results);
		        $scope.loading = false;
		        if(moreTweets.length<15){
		        	document.getElementById('loadMore').style.display="none";
		        }else{
	        		document.getElementById('loadMore').style.display="block";
	        	}	
	    	}    
	        
	    })
	    .error (function (data) {
	    	console.log(data);
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

kayako.filter('formatTime', function () {
	return function (text, length, end) {
		var currentTime = new Date;
		var tweetTime = new Date(text);
		var timeDiff = (currentTime - tweetTime)/1000;
		if(timeDiff < 60){
			return (timeDiff+'s');
		}else if(timeDiff < 3600){
			var mins = Math.floor(timeDiff/60);
			return (mins+'min');
		}else if(timeDiff < 86400){
			var hrs = Math.floor(timeDiff/3600);
			return (hrs+'hr');
		}else{
			var days = Math.floor(timeDiff/86400);
			return (days+'days');
		}
	};
});

/*adds clickability to the hastags*/
function empowerHash(input){
	return String(input).replace(/#[^\s]*\ /g, function (s) {
		tagVal = s.substr(1);
    	return ("<a href=\"#\" ng-click=\"setTag('"+tagVal.substring(0, tagVal.length-1)+"')\">"+s+"</a>");
    });	
}
