# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Imcon.Repo.insert!(%Imcon.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Imcon.Thorn
alias Imcon.Thorn.User
alias Imcon.Repo

[
  %{
    first_name: "John",
    last_name: "Doe",
    email: "john@phoenix-trello.com",
    password: "12345678"
  },
]
|> Enum.map(&Thorn.user_changeset(%User{}, &1))
|> Enum.each(&Repo.insert!(&1))
