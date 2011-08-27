class LeagueController < ApplicationController
  def show_teams
    @teams = Team.where(:league_id => params[:id])

    render :json => @teams
  end

end
