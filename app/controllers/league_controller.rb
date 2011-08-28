class LeagueController < ApplicationController
  def show_teams
    @teams = Team.where(:league_id => params[:id])

    render :json => @teams.to_json(:include => {:current_roster => {:include => :players}})        
  end

end
