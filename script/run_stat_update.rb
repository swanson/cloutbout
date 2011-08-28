#!/usr/bin/env ruby

require "rubygems"
require "time"
require "get_stats"
require "rest_client"
require "json"
require "hashie"

Endpoint = "http://cloutboutapp.com/"
AllPlayers = Endpoint + "players/all"
SetScore = Endpoint + "players/set_score"
StartTime = Time.now() - 60*60*24*7


def get_player_list
    res = RestClient.get(AllPlayers)
    if res.code != 200
        raise IOError
    end
    player_list = JSON.parse(res.body())
    hashie_list = []
    for player in player_list
        h = Hashie::Mash.new(player['player'])
        hashie_list += [h]
    end
    return hashie_list
end

def update_score(player)
    real_name = player.name[1..-1]
    score = get_score_starting_at(real_name, StartTime)
    j = {:name => player.name, :score => score}.to_json
    puts "#{player.name}: #{score} points"
    res = RestClient.post(SetScore, j, :content_type => :json)
    if res.code != 200
        raise IOError
    end
end

def update_all_scores
    player_list = get_player_list()
    for player in player_list
        update_score(player)
    end
end


update_all_scores()

