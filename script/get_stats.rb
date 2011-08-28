#!/usr/bin/env ruby

require "rubygems"
require "twitter"
require "time"
require "hashie"

Twitter.configure do |config|
  config.consumer_key = ENV["CONSUMER_KEY"]
  config.consumer_secret = ENV["CONSUMER_SECRET"]
  config.oauth_token = ENV["OAUTH_TOKEN"]
  config.oauth_token_secret = ENV["OAUTH_TOKEN_SECRET"]
  config.endpoint = "http://api.twitter.com/1/"
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
    new_tweets = Twitter.user_timeline(user, :count => 200, :page => page, :include_entities => true)
    while true
        all_tweets += new_tweets
        if found_earlier(new_tweets, start_t) or new_tweets.size() == 0
            break
        end
        page += 1
        new_tweets = Twitter.user_timeline(user, :count => 200, :page => page, :include_entities => true)
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
        num = tweet.retweet_count
        if num == "100+"
            sum += 150
        else
            sum += num
        end
        #puts "name: #{tweet.user.screen_name} num: #{num} id: #{tweet.id_str}" 
    end
    return sum
end

def url_count(tweets)
    sum = 0
    for tweet in tweets
        sum += tweet.entities.urls.size()
    end
    return sum
end

def hashtag_count(tweets)
    sum = 0
    for tweet in tweets
        sum += tweet.entities.hashtags.size()
    end
    return sum
end

def mentions_count(tweets)
    sum = 0
    for tweet in tweets
        sum += tweet.entities.user_mentions.size()
    end
    return sum
end

def get_stats(user, start)
    tweets_this_week = get_tweets_for_week(user, start)
    user_info = Twitter.user(user)
    
    num_rt = rt_count(tweets_this_week)
    num_url = url_count(tweets_this_week)
    num_hashtag = hashtag_count(tweets_this_week)
    num_mentions = mentions_count(tweets_this_week)
    num_tweets_this_week = tweets_this_week.size()
    num_followers = user_info.followers_count
    num_friends = user_info.friends_count
    num_favs = user_info.favourites_count
    num_listed = user_info.listed_count

    return Hashie::Mash.new({
        :rt => num_rt,
        :url => num_url,
        :hashtag => num_hashtag,
        :mentions => num_mentions,
        :tweets => num_tweets_this_week,
        :followers => num_followers,
        :friends => num_friends,
        :favs => num_favs,
        :listed => num_listed,
    })
end

def get_score(stats)
    tweet = stats.tweets
    mention = stats.mentions * 0.1
    hashtag = stats.hashtag * 0.1
    url = stats.url * 0.25
    rt = stats.rt * 1.5

    #puts "tweet: #{tweet} mention: #{mention} hashtag: #{hashtag} url: #{url} rt #{rt}"

    return tweet + mention + hashtag + url + rt
end

def get_score_starting_at(user, start)
    stats = get_stats(user, start)
    return get_score(stats)
end

