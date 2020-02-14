defmodule Imcon.Thorn.Card do

  use Ecto.Schema
  alias Imcon.Thorn.{List, Comment, CardMember}

  @derive {Poison.Encoder, only: [:id, :list_id, :name, :description, :position, :comment, :tags, :member]}

  schema "card" do
    field :name, :string
    field :description, :string
    field :position, :integer
    field :tags, {:array, :string}

    belongs_to :list, List
    has_many :comment, Comment
    has_many :card_member, CardMember
    has_many :member, through: [:card_member, :user]

    timestamps()
  end

end
