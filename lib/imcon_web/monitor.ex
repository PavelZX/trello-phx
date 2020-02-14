defmodule ImconWeb.Monitor do
  @moduledoc """
  Board monitor that keeps track of connected users.
  """

  use GenServer

  #####
  # External API

  def create(board_id) do
    case GenServer.whereis(ref(board_id)) do
      nil ->
        Supervisor.start_child(ImconWeb.Supervisor, [board_id])
      _board ->
        {:error, :board_already_exists}
    end
  end

  def start_link(board_id) do
    GenServer.start_link(__MODULE__, [], name: ref(board_id))
  end

  def user_joined(board_id, un_user) do
   try_call board_id, {:user_joined, un_user}
  end

  def user_in_board(board_id) do
   try_call board_id, {:user_in_board}
  end

  def user_left(board_id, un_user) do
    try_call board_id, {:user_left, un_user}
  end

  #####
  # GenServer implementation

  def handle_call({:user_joined, un_user}, _from, user) do
    user = [un_user] ++ user
      |> Enum.uniq

    {:reply, user, user}
  end

  def handle_call({:user_in_board}, _from, user) do
    { :reply, user, user }
  end

  def handle_call({:user_left, un_user}, _from, user) do
    user = List.delete(user, un_user)
    { :reply, user, user }
  end

  defp ref(board_id) do
    {:global, {:board, board_id}}
  end

  defp try_call(board_id, call_function) do
    case GenServer.whereis(ref(board_id)) do
      nil ->
        {:error, :invalid_board}
      board ->
        GenServer.call(board, call_function)
    end
  end
end
