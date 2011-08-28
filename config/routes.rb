Cloutbout::Application.routes.draw do
  get "leaderboard/global"

  get "leaderboard/league"

  get "leaderboard/players"

  get "league/:id/show_teams" => 'league#show_teams'

  get "players/all"

  get "players/set_score"

  get "user/get_team"
  get "user/get_following"
  get "user/logged_in"

  match '/team/:id/roster' => 'team#roster'
  match '/team/:id/add_player' => 'team#add_player'
  resources :team


  root :to => 'home#index'

  match '/auth/:provider/callback' => 'sessions#create'
  match '/auth/failure' => 'sessions#failure'

  match '/signout' => 'sessions#destroy', :as => :signout
  match '/signin' => 'sessions#new', :as => :signin

  match ':controller(/:action(/:id))'
end
