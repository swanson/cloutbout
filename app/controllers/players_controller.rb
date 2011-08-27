class PlayersController < ApplicationController
  def all
    render :json => Player.all
  end

  def set_score
      player = Player.where(:name => params['name']).first
      player.current_score = params['score'].to_f
      player.save
  end

end
