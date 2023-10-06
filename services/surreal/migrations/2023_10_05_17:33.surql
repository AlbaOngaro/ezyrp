REMOVE PARAM $brevoapikey;

REMOVE EVENT profile ON TABLE user;

DEFINE EVENT create_user_profile ON TABLE user WHEN $event = "CREATE" THEN (
	CREATE profile SET user = $value.id
);

REMOVE EVENT customer_created ON TABLE customer;

DEFINE EVENT set_customer_workspace ON TABLE customer WHEN $event = "CREATE" THEN {
	UPDATE customer MERGE {
		workspace: $auth.workspace,
		created_at: time::now()
	} WHERE id = $after.id;
};

REMOVE EVENT invoice_created ON TABLE invoice;

DEFINE EVENT set_invoice_wrorkspace ON TABLE invoice WHEN $event = "CREATE" THEN {
	UPDATE invoice MERGE {
		workspace: $auth.workspace,
		created_at: time::now()
	} WHERE id = $after.id;
};

REMOVE EVENT event_created ON TABLE event;

DEFINE EVENT set_event_workspace ON TABLE event WHEN $event = "CREATE" THEN {
	UPDATE event MERGE {
		workspace: $auth.workspace,
		created_at: time::now()
	} WHERE id = $after.id;
};

REMOVE EVENT item_created ON TABLE item;

DEFINE EVENT set_item_workspace ON TABLE item WHEN $event = "CREATE" THEN {
	UPDATE item MERGE {
		workspace: $auth.workspace,
		created_at: time::now()
	} WHERE id = $after.id;
};

REMOVE EVENT item_deleted ON TABLE item;
REMOVE EVENT item_updated ON TABLE item;