defmodule PhoenixTrello.Repo.Migrations.CreateList do
  use Ecto.Migration

  def change do
    create table(:list) do
      add :name, :string, null: false
      add :position, :integer, defaul: 0
      add :board_id, references(:board, on_delete: :delete_all)

      timestamps()
    end

    create index(:list, [:board_id])
  end
end
