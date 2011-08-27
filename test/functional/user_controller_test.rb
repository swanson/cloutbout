require 'test_helper'

class UserControllerTest < ActionController::TestCase
  test "should get get_team" do
    get :get_team
    assert_response :success
  end

end
