class UserController < ApplicationController
  def get_team
    if user_signed_in?
      @team = Team.where(:owner_id => current_user).first
    end
    render :json => @team
  end

  def get_following
    def prepare_access_token(oauth_token, oauth_token_secret)
      consumer = OAuth::Consumer.new(ENV['CLOUDBOUT_KEY'], ENV['CLOUDBOUT_SECRET'],
                                     { :site => "http://api.twitter.com"})
      
      token_hash = { :oauth_token => oauth_token, :oauth_token_secret => oauth_token_secret }
      access_token = OAuth::AccessToken.from_hash(consumer, token_hash )
      return access_token
    end

    access_token = prepare_access_token(current_user.token, current_user.secret)
    response = access_token.request(:get, "http://api.twitter.com/1/friends/ids.json?screen_name=#{current_user.name}")

    render :json => response.body
  end
end
