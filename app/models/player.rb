class Player < ActiveRecord::Base
  has_and_belongs_to_many :rosters

  def self.create_new(name)
    begin
      create! do |player|
        player.name = name
      end
    rescue Exception
      raise Exception, "cannot create user record"
    end
  end
end
