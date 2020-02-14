defmodule Imcon.Thorn.List do

  use Ecto.Schema
  alias Imcon.Thorn.{Card, Board}

  @derive {Poison.Encoder, only: [:id, :board_id, :name, :position, :card]}

  schema "list" do
    field :name, :string
    field :position, :integer

    belongs_to :board, Board
    has_many :card, Card

    timestamps()
  end
end
