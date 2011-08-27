class User < ActiveRecord::Base

  has_many :teams
  attr_accessible :provider, :uid, :name, :email

  def self.create_with_omniauth(auth)
    begin
      create! do |user|
        user.provider = auth['provider']
        user.uid = auth['uid']
        if auth['user_info']
          user.name = auth['user_info']['nickname'] if auth['user_info']['nickname']
        end
      end
    rescue Exception
      raise Exception, "cannot create user record"
    end
  end
end
