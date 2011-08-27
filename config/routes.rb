Cloutbout::Application.routes.draw do
  get "players/all"

  get "players/set_score"

  get "user/get_team"
  get "user/get_following"

  match '/team/:id/roster' => 'team#roster'
  resources :team


  root :to => 'home#index'

  match '/auth/:provider/callback' => 'sessions#create'
  match '/auth/failure' => 'sessions#failure'

  match '/signout' => 'sessions#destroy', :as => :signout
  match '/signin' => 'sessions#new', :as => :signin

  match ':controller(/:action(/:id))'
end
