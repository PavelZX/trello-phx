defmodule ImconWeb.BoardController do
  use ImconWeb, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: ImconWeb.SessionController
  plug :scrub_params, "board" when action in [:create]

  import Imcon.Thorn
  alias Imcon.Repo

  def index(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn)
    IO.inspect(current_user)
    owned_board = current_user
      |> assoc(:owned_board)
      |> board_preload_all
      |> Repo.all

    invited_board = current_user
      |> assoc(:board)
      |> not_owned_by(current_user.id)
      |> board_preload_all
      |> Repo.all

    render(conn, "index.json", owned_board: owned_board, invited_board: invited_board)
  end

  def create(conn, %{"board" => board_params}) do
    current_user = Guardian.Plug.current_resource(conn)

    changeset = current_user
      |> build_assoc(:owned_board)
      |> board_changeset(board_params)

    if changeset.valid? do
      board = Repo.insert!(changeset)

      board
      |> build_assoc(:user_board)
      |> user_board_changeset(%{user_id: current_user.id})
      |> Repo.insert!

      conn
      |> put_status(:created)
      |> render("show.json", board: board )
    else
      conn
      |> put_status(:unprocessable_entity)
      |> render("error.json", changeset: changeset)
    end
  end
end
