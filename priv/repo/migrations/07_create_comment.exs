defmodule PhoenixTrello.Repo.Migrations.CreateComment do
  use Ecto.Migration

  def change do
    create table(:comment) do
      add :text, :string, null: false
      add :user_id, references(:user, on_delete: :delete_all)
      add :card_id, references(:card, on_delete: :delete_all)

      timestamps()
    end
    
    create index(:comment, [:user_id])
    create index(:comment, [:card_id])
  end
end
