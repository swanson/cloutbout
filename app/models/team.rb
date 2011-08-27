class Team < ActiveRecord::Base
  belongs_to :owner, :class_name => 'User'
  has_one :league
  has_one :current_roster, :class_name => 'Roster'
  has_one :future_roster, :class_name => 'Roster'
end
