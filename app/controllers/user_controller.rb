class UserController < ApplicationController
  def get_team
    if user_signed_in?
      @team = Team.where(:owner_id => current_user).first
    end
    render :json => @team
  end
end
