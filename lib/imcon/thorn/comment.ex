defmodule Imcon.Thorn.Comment do

  use Ecto.Schema
  alias Imcon.Thorn.{User, Card}

  @derive {Poison.Encoder, only: [:id, :user, :card_id, :text, :inserted_at]}
  
  schema "comment" do
    field :text, :string

    belongs_to :user, User
    belongs_to :card, Card

    timestamps()
  end

end
