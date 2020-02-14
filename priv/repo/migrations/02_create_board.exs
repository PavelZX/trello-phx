defmodule PhoenixTrello.Repo.Migrations.CreateBoard do
  use Ecto.Migration

  def change do
    create table(:board) do
      add :name, :string, null: false

      add :user_id, references(:user, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:board, [:user_id])
  end
end
