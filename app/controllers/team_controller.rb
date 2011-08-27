class TeamController < ApplicationController
  before_filter :get_team, :only => [:show, :update, :destroy, 
                                     :add_player, :roster
                                    ]

  def new
    @team = Team.new
  end

  def create
    @team = Team.new params[:team]
    if @team.save
      flash[:notice] = 'Team created!'
      redirect_to @team
    else
        render :action => 'new'
    end
  end

  def update
    if @team.update_attributes(params[:team])
      redirect_to @team, :notice => 'Team updated!'
    else
      render :action => 'update'
    end
  end

  def destroy
    @team.destroy
  end

  def show
    render :json => @team
  end

  def add_player
    new_player = Player.where(:name => params[:name]).first ||
        Player.create_new(params[:name])
    
    if @team.future_roster.nil?
      @team.build_future_roster
    end

    @team.future_roster.players << new_player
    @team.save

    render :json => @team
  end

  def roster
    @roster = Roster.where(:team_id => @team).first
    render :json => @roster.players
  end

  private
  def get_team
    @team = Team.find(params[:id])
  end

end
