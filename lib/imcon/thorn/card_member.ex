defmodule Imcon.Thorn.CardMember do

  use Ecto.Schema
  alias Imcon.Thorn.{Card, UserBoard}

  schema "card_member" do
    belongs_to :card, Card
    belongs_to :user_board, UserBoard
    has_one :user, through: [:user_board, :user]

    timestamps()
  end

end
