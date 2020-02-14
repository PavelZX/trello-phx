defmodule ImconWeb.CurrentUserController do
  use ImconWeb, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: ImconWeb.SessionController

  def show(conn, _) do
    user = Guardian.Plug.current_resource(conn)

    conn
    |> put_status(:ok)
    |> render("show.json", user: user)
  end
end
