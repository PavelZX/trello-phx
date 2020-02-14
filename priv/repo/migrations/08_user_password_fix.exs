defmodule PhoenixTrello.Repo.Migrations.UserPasswordFix do
  use Ecto.Migration

  def change do
    rename table(:user), :crypted_password, to: :encrypted_password
  end
end
