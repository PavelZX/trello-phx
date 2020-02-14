defmodule ImconWeb.UserSocket do
  use Phoenix.Socket

  alias ImconWeb.{GuardianSerializer, BoardChannel, UserChannel}

  # Channels
  channel "board:*", BoardChannel
  channel "user:*", UserChannel

  # Transports
  transport :websocket, Phoenix.Transports.WebSocket
  transport :longpoll, Phoenix.Transports.LongPoll

  def connect(%{"token" => token}, socket) do
    case Guardian.decode_and_verify(token) do
      {:ok, claims} ->
        case GuardianSerializer.from_token(claims["sub"]) do
          {:ok, user} ->
            {:ok, assign(socket, :current_user, user)}
          {:error, _reason} ->
            :error
        end
      {:error, _reason} ->
        :error
    end
  end

  def connect(_params, _socket), do: :error

  def id(socket), do: "user_socket:#{socket.assigns.current_user.id}"
end
