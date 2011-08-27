#!/usr/bin/env ruby

require "rubygems"
require "twitter"
require "time"

Twitter.configure do |config|
  config.consumer_key = ENV["CONSUMER_KEY"]
  config.consumer_secret = ENV["CONSUMER_SECRET"]
  config.oauth_token = ENV["OAUTH_TOKEN"]
  config.oauth_token_secret = ENV["OAUTH_TOKEN_SECRET"]
end

def found_earlier(tweets, time)
    for tweet in tweets
        c_time = Time.parse(tweet.created_at)
        if c_time < time
            return true
        end
    end
    return false
end

def get_tweets_for_week(user, start_t)
    end_t = start_t + 60*60*24*7
    page = 1
    all_tweets = []
    new_tweets = Twitter.user_timeline(user, :count => 200, :page => page)
    while true
        all_tweets += new_tweets
        if found_earlier(new_tweets, start_t) or new_tweets.size() == 0
            break
        end
        page += 1
        new_tweets = Twitter.user_timeline(user, :count => 200, :page => page)
    end
    week_tweets = []
    for tweet in all_tweets
        c_time = Time.parse(tweet.created_at)
        if c_time >= start_t and c_time <= end_t
            week_tweets += [tweet]
        end
    end
    return week_tweets
end

def rt_count(tweets)
    sum = 0
    for tweet in tweets
        if tweet.retweet_count == "100+"
            sum += 150
        else
            sum += tweet.retweet_count
        end
    end
    return sum
end


