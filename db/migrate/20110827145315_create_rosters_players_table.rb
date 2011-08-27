class CreateRostersPlayersTable < ActiveRecord::Migration
  def self.up
    create_table :players_rosters, :id => false, :force => true do |t|
      t.integer :roster_id
      t.integer :player_id
      t.timestamps
    end
  end

  def self.down
    drop_table :players_rosters
  end
end
