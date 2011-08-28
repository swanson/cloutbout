require 'test_helper'

class LeaderboardControllerTest < ActionController::TestCase
  test "should get global" do
    get :global
    assert_response :success
  end

  test "should get league" do
    get :league
    assert_response :success
  end

  test "should get players" do
    get :players
    assert_response :success
  end

end
