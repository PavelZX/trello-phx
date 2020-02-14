defmodule PhoenixTrello.Repo.Migrations.AddSlugToBoard do
  use Ecto.Migration

  def change do
    alter table(:board) do
      add :slug, :string
    end
  end
end
