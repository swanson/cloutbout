class User < ActiveRecord::Base

  has_many :teams
  attr_accessible :provider, :uid, :name, :email, :token, :secret

  def self.create_with_omniauth(auth)
    begin
      puts '##########'
      create! do |user|
        user.provider = auth['provider']
        user.uid = auth['uid']
        user.token = auth['credentials']['token']
        user.secret = auth['credentials']['secret']
        if auth['user_info']
          user.name = auth['user_info']['nickname'] if auth['user_info']['nickname']
        end
      end
    rescue Exception
      raise Exception, "cannot create user record"
    end
  end
end
