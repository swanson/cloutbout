require 'test_helper'

class LeagueControllerTest < ActionController::TestCase
  test "should get show_teams" do
    get :show_teams
    assert_response :success
  end

end
