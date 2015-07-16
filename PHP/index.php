<?php
ini_set('display_errors', 1);
require_once('TwitterAPIExchange.php');

/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
$settings = array(
    'oauth_access_token' => "119309269-nEXxBTvDGrMkJg23VQHHPLfrTBBNjfBC4Jlv9KBm",
    'oauth_access_token_secret' => "fEYttWKBduP2WQXbIaJKMFZyJGeocIReGUAdN8zdJiJmE",
    'consumer_key' => "njmc8CrN7A30qoAKTuvkX7jgA",
    'consumer_secret' => "dCqtb5TRZeNWcqNNefZpH8zH8v8bQmJz328ltL0SyiIbGHxjuc"
);

$url    = 'https://api.twitter.com/1.1/search/tweets.json';
$requestMethod = 'GET';
$hashTag = isset($_GET["q"])?$_GET["q"]:'';
$max_id = isset($_GET["max_id"])?"&max_id=".$_GET["max_id"]:'';
$callback = isset($_GET["callback"])?$_GET["callback"]:'';
$getfield = 'q=#'.$hashTag.$max_id."&callback=".$callback.""; 
$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest();
