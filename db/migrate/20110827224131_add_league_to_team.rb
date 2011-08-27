class AddLeagueToTeam < ActiveRecord::Migration
  def self.up
    change_table :teams do |t|
      t.references :league
    end
  end

  def self.down

  end
end
