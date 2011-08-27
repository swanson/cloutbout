Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, ENV['CLOUDBOUT_KEY'], ENV['CLOUDBOUT_SECRET']
end
