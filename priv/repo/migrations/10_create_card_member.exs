defmodule PhoenixTrello.Repo.Migrations.CreateCardMember do
  use Ecto.Migration

  def change do
    create table(:card_member) do
      add :card_id, references(:card, on_delete: :delete_all), null: false
      add :user_board_id, references(:user_board, on_delete: :delete_all), null: false

      timestamps()
    end

    create index(:card_member, [:card_id])
    create index(:card_member, [:user_board_id])
    create unique_index(:card_member, [:card_id, :user_board_id])
  end
end
