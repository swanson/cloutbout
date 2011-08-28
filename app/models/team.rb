class Team < ActiveRecord::Base
  belongs_to :owner, :class_name => 'User'
  has_one :league
  has_one :current_roster, :class_name => 'Roster'
  has_one :future_roster, :class_name => 'Roster'

  def after_find
    score = 0
    return if self.current_roster.nil?
    self.current_roster.players.each do |player|
      if !player.current_score.nil?
        score += player.current_score
      end
    end
    self.current_score = score
  end

end
