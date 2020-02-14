defmodule Hound.Browser.Chrome do
  @moduledoc false

  @behaviour Hound.Browser

  def default_user_agent, do: :chrome

  def user_agent_capabilities(ua) do
    %{chromeOptions: %{"args" => ["--user-agent=#{ua}"]}}
  end
end
