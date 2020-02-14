defmodule Imcon.CardController do
  use ImconWeb, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: ImconWeb.SessionController

  def show(conn, %{"board_id" => board_id, "id" => card_id}) do
    card = Imcon.Thorn.Card
     |> Imcon.Thorn.get_by_user_and_board(card_id, current_user(conn).id, board_id)
     |> Imcon.Repo.one!

    render(conn, "show.json", card: card)
  end

  defp current_user(conn)  do
    Guardian.Plug.current_resource(conn)
  end
end
