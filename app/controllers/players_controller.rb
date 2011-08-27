class PlayersController < ApplicationController
  def all
    render :json => Player.all
  end

  def set_score
      player = Player.find(params['id'])
      player.current_score = params['score'].to_f
      player.save
  end

end
