require 'test_helper'

class PlayersControllerTest < ActionController::TestCase
  test "should get all" do
    get :all
    assert_response :success
  end

  test "should get set_score" do
    get :set_score
    assert_response :success
  end

end
