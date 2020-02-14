defmodule Imcon.Thorn.UserBoard do

  use Ecto.Schema
  alias Imcon.Thorn.{User, Board}

  schema "user_board" do
    belongs_to :user, User
    belongs_to :board, Board

    timestamps()
  end
  
end
