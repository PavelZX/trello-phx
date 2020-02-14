defmodule PhoenixTrello.Repo.Migrations.AddTagsToCard do
  use Ecto.Migration

  def change do
    alter table(:card) do
      add :tags, {:array, :string}, default: []
    end

    create index(:card, [:tags])
  end
end
