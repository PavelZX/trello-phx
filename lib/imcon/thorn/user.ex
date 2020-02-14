defmodule Imcon.Thorn.User do
  
  use Ecto.Schema
  alias Imcon.Thorn.{Board, UserBoard}

  @derive {Poison.Encoder, only: [:id, :first_name, :last_name, :email]}

  schema "user" do
    field :first_name, :string
    field :last_name, :string
    field :email, :string
    field :encrypted_password, :string
    field :password, :string, virtual: true

    has_many :owned_board, Board
    has_many :user_board, UserBoard
    has_many :board, through: [:user_board, :board]

    timestamps()
  end

end
