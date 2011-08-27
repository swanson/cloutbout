class CreateTeams < ActiveRecord::Migration
  def self.up
    create_table :teams do |t|
      t.references :owner, :class_name => 'User'
      t.string :name
      t.string :image_url
      t.float :previous_score
      t.float :current_score

      t.timestamps
    end
  end

  def self.down
    drop_table :teams
  end
end
