class LeaderboardController < ApplicationController
  def global
    @teams = Team.find(:all, :limit => 10, :order => "current_score desc")

    render :json => @teams
  end

  def league
    #hack
    @teams = League.all().first.teams.sort {|a,b| a.current_score <=> b.current_score}

    render :json => @teams.reverse
  end

  def players
    @players = Player.find(:all, :limit => 10, :order => "current_score desc")

    render :json => @players
  end

end
