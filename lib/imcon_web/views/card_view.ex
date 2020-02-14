defmodule ImconWeb.CardView do
  use ImconWeb, :view

  def render("show.json", %{card: card}) do
    card
  end
end
