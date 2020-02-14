defmodule PhoenixTrello.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:user) do
      add :first_name, :string, null: false
      add :last_name, :string, null: false
      add :email, :string, null: false
      add :crypted_password, :string, null: false

      timestamps()
    end

    create unique_index(:user, [:email])
  end
end
