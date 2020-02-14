defmodule ImconWeb.Router do
  use ImconWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json", "xml"]
    plug :fetch_session
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  scope "/api", ImconWeb do
    pipe_through :api

    scope "/v1" do
      post "/registrations", RegistrationController, :create

      post "/sessions", SessionController, :create
      delete "/sessions", SessionController, :delete

      get "/current_user", CurrentUserController, :show

      resources "/board", BoardController, only: [:index, :create] do
        resources "/card", CardController, only: [:show]
      end
    end
  end

  scope "/", ImconWeb do
    pipe_through :browser # Use the default browser stack

    get "/*path", PageController, :index
  end
end
