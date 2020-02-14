defmodule ImconWeb.BoardView do
  use ImconWeb, :view

  def render("index.json", %{owned_board: owned_board, invited_board: invited_board}) do
    %{owned_board: owned_board, invited_board: invited_board}
  end

  def render("show.json", %{board: board}) do
    %{
      id: board |> Imcon.Thorn.slug_id,
      name: board.name,
      user_id: board.user_id
    }
  end

  def render("error.json", %{changeset: changeset}) do
    errors = Enum.map(changeset.errors, fn {field, detail} ->
      %{} |> Map.put(field, detail)
    end)

    %{
      errors: errors
    }
  end
end
