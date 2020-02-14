# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :imcon,
  ecto_repos: [Imcon.Repo]

# Configures the endpoint
config :imcon, ImconWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "xwBv9uRfkEpl0JUrqE7u4C3cSDZD8dc33U2EVlWigIQqeerlwJXUd7FmbeM8KiQJ",
  render_errors: [view: ImconWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: ImconWeb.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Configure guardian
config :guardian, Guardian,
  allowed_algos: ["HS512"], # optional
  verify_module: Guardian.JWT,  # optional
  issuer: "ImconWeb",
  ttl: { 3, :days },
  verify_issuer: true,
  secret_key: "w3A7N/+OuvCHLPC09r/XAtojeXfWYOrRFC7ttZAsW0ZJavMw1ffo1s5ZwIzY7Lbk",
  serializer: ImconWeb.GuardianSerializer

# Start Hound for PhantomJs
config :hound, driver: "chrome_driver"

config :mime, :types, %{
      "application/json" => ["json"],
      "application/xml" => ["xml"]
    }
