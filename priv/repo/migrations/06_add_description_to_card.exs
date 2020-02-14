defmodule PhoenixTrello.Repo.Migrations.AddDescriptionToCard do
  use Ecto.Migration

  def change do
    alter table(:card) do
      add :description, :text
    end
  end
end
