defmodule Imcon.Thorn do
  @moduledoc """
  The boundary for the Thorn system.
  """
  import Ecto.Changeset
  import Ecto.Query, only: [from: 2]

  alias Imcon.Repo

  alias Imcon.Thorn.{UserBoard, User, Board, Card, CardMember, Comment, List}

  # ... UserBoard

  @required_fields ~w(user_id board_id)
  @optional_fields ~w()

  def user_board_changeset(user_board, attrs \\ %{}) do
    user_board
    |> cast(attrs, @required_fields, @optional_fields)
    |> unique_constraint(:user_id, name: :user_board_user_id_board_id_index)
  end

  def find_by_user_and_board(query \\ %UserBoard{}, user_id, board_id) do
    from u in query,
    where: u.user_id == ^user_id and u.board_id == ^board_id
  end

  # ... User

  @required_fields ~w(first_name last_name email password)
  @optional_fields ~w(encrypted_password)

  def user_changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, @required_fields, @optional_fields)
    |> validate_format(:email, ~r/@/)
    |> validate_length(:password, min: 5)
    |> validate_confirmation(:password, message: "Password does not match")
    |> unique_constraint(:email, message: "Email already taken")
    |> generate_encrypted_password
  end
  
  defp generate_encrypted_password(current_changeset) do
    case current_changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(current_changeset, :encrypted_password, Comeonin.Bcrypt.hashpwsalt(password))
      _ ->
        current_changeset
    end
  end

  # ... Board

  @required_fields ~w(name user_id)
  @optional_fields ~w(slug)

  def board_changeset(%Board{} = board, attrs) do
    board
    |> cast(attrs, @required_fields, @optional_fields)
    |> slugify_name()
  end

  def not_owned_by(query \\ %Board{}, user_id) do
    from b in query,
    where: b.user_id != ^user_id
  end

  def board_preload_all(query) do
    comment_query = from c in Comment, order_by: [desc: c.inserted_at], preload: :user
    card_query = from c in Card, order_by: c.position, preload: [[comment: ^comment_query], :member]
    list_query = from l in List, order_by: l.position, preload: [card: ^card_query]

    from b in query, preload: [:user, :member, list: ^list_query]
  end

  def slug_id(board) do
    "#{board.id}-#{board.slug}"
  end

  defp slugify_name(current_changeset) do
    if name = get_change(current_changeset, :name) do
      put_change(current_changeset, :slug, slugify(name))
    else
      current_changeset
    end
  end

  defp slugify(value) do
    value
    |> String.downcase()
    |> String.replace(~r/[^\w-]+/, "-")
  end

  # ... Card

  @required_fields ~w(name list_id)
  @optional_fields ~w(description position tags)
  
  def card_changeset(%Card{} = card, attrs) do
    card
    |> cast(attrs, @required_fields, @optional_fields)
    |> card_calculate_position()
  end

  def card_update_changeset(card, attrs \\ %{}) do
    card
    |> cast(attrs, @required_fields, @optional_fields)
  end

  defp card_calculate_position(current_changeset) do
    card = current_changeset.data

    query = from(c in Card,
            select: c.position,
            where: c.list_id == ^(card.list_id),
            order_by: [desc: c.position],
            limit: 1)

    case Repo.one(query) do
      nil      -> put_change(current_changeset, :position, 1024)
      position -> put_change(current_changeset, :position, position + 1024)
    end
  end

  def card_preload_all(query \\ %Card{}) do
    comment_query = from c in Comment, order_by: [desc: c.inserted_at], preload: :user

    from c in query, preload: [:member, [comment: ^comment_query]]
  end

  def get_by_user_and_board(query \\ %Card{}, card_id, user_id, board_id) do
    from c in query,
      left_join: co in assoc(c, :comment),
      left_join: cu in assoc(co, :user),
      left_join: me in assoc(c, :member),
      join: l in assoc(c, :list),
      join: b in assoc(l, :board),
      join: ub in assoc(b, :user_board),
      where: ub.user_id == ^user_id and b.id == ^board_id and c.id == ^card_id,
      preload: [comment: {co, user: cu }, member: me]
  end

  # ... CardMember
  
  @required_fields ~w(card_id user_board_id)
  @optional_fields ~w()

  def card_member_changeset(%CardMember{} = card_member, attrs) do
    card_member
    |> cast(attrs, @required_fields, @optional_fields)
    |> unique_constraint(:user_board_id, name: :card_member_card_id_user_board_id_index)
  end

  def get_by_card_and_user_board(query \\ %CardMember{}, card_id, user_board_id) do
    from cm in query,
    where: cm.card_id == ^card_id and cm.user_board_id == ^user_board_id,
    limit: 1
  end

  # ... Comment

  @required_fields ~w(user_id card_id text)
  @optional_fields ~w()

  def comment_changeset(comment, attrs \\ %{}) do
    comment
    |> cast(attrs, @required_fields, @optional_fields)
  end

  # ... List

  @required_fields ~w(name)
  @optional_fields ~w(position)

  def list_changeset(%List{} = list, attrs) do
    list
    |> cast(attrs, @required_fields, @optional_fields)
    |> list_calculate_position()
  end

  def list_update_changeset(%List{} = list, attrs) do
    list
    |> cast(attrs, @required_fields, @optional_fields)
  end

  defp list_calculate_position(current_changeset) do
    list = current_changeset.data

    query = from(l in List,
            select: l.position,
            where: l.board_id == ^(list.board_id),
            order_by: [desc: l.position],
            limit: 1)

    case Repo.one(query) do
      nil      -> put_change(current_changeset, :position, 1024)
      position -> put_change(current_changeset, :position, position + 1024)
    end
  end

  # ...

end

defimpl Phoenix.Param, for: Imcon.Thorn do
  def to_param(%{slug: slug, id: id}) do
    "#{id}-#{slug}"
  end
end

defimpl Poison.Encoder, for: Any do
  def encode(%{__struct__: _} = struct, options) do
    map = struct
          |> Map.from_struct
          |> san_map
    Poison.Encoder.Map.encode(map, options)
  end

  defp san_map(map) do
    Map.drop(map, [:__meta__, :__struct__])
  end
end

defimpl Poison.Encoder, for: Imcon.Thorn.Board do
  def encode(board, options) do
    board
    |> Map.take([:name, :list, :user, :member,])
    |> Map.put(:id, Imcon.Thorn.slug_id(board))
    |> Poison.Encoder.encode(options)
  end
end