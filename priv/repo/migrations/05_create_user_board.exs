defmodule PhoenixTrello.Repo.Migrations.CreateUserBoard do
  use Ecto.Migration

  def change do
    create table(:user_board) do
      add :user_id, references(:user, on_delete: :delete_all), null: false
      add :board_id, references(:board, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:user_board, [:user_id])
    create index(:user_board, [:board_id])
    create unique_index(:user_board, [:user_id, :board_id])
  end
end
