class UserController < ApplicationController
  def get_team
    if user_signed_in?
      @team = Team.where(:owner_id => current_user).first
      render :json => @team
    else
      render :text => "Error getting team"
    end
  end

  def get_following
    Twitter.configure do |config|
      config.consumer_key = ENV['CLOUDBOUT_KEY']
      config.consumer_secret = ENV['CLOUDBOUT_SECRET']
      config.oauth_token = current_user.token
      config.oauth_token_secret = current_user.secret
    end

    client = Twitter::Client.new
    cursor = -1
    following = []
    begin
      response = client.friends :cursor => cursor
      following += response.users
      cursor = response.next_cursor
    end
    people = following.sort{|a,b| a.followers_count <=> b.followers_count}.reverse
    render :json => people.first(10)
  end

  def logged_in
    status = false
    status = true if user_signed_in?
    render :json => { :logged_in => status }
  end
end
