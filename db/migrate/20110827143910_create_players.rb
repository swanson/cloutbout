class CreatePlayers < ActiveRecord::Migration
  def self.up
    create_table :players do |t|
      t.string :name
      t.float :current_score
      t.float :previous_score

      t.timestamps
    end
  end

  def self.down
    drop_table :players
  end
end
