defmodule PhoenixTrello.Repo.Migrations.CreateCard do
  use Ecto.Migration

  def change do
    create table(:card) do
      add :name, :string, null: false
      add :position, :integer, default: 0
      add :list_id, references(:list, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:card, [:list_id])
  end
end
