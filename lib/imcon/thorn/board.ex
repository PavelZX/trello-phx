defmodule Imcon.Thorn.Board do

  use Ecto.Schema
  alias Imcon.Thorn.{User, List, UserBoard}

  @primary_key {:id, ImconWeb.Permalink, autogenerate: true}

  schema "board" do
    field :name, :string
    field :slug, :string

    belongs_to :user, User
    has_many :list, List
    has_many :card, through: [:list, :card]
    has_many :user_board, UserBoard
    has_many :member, through: [:user_board, :user]

    timestamps()
  end
end
