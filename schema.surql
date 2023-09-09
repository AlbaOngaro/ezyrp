-- ------------------------------
-- OPTION
-- ------------------------------

OPTION IMPORT;

-- ------------------------------
-- SCOPES
-- ------------------------------

DEFINE SCOPE allusers SESSION 2w 
SIGNIN (
	SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(password, $password)
)
SIGNUP (
	CREATE user CONTENT {
		email: $email,
		username: IF $username THEN $username ELSE string::concat('@', string::split($email, '@')[0]) END,
		password: crypto::argon2::generate($password),
		workspace: IF $workspace THEN $workspace ELSE type::string((SELECT VALUE id FROM (CREATE workspace))[0]) END
	}
);

-- ------------------------------
-- EVENTS
-- ------------------------------

DEFINE EVENT profile ON TABLE user WHEN $before == NONE THEN (
	CREATE profile SET user = $value.id
);

DEFINE EVENT customer_created ON TABLE customer WHEN $event = "CREATE" THEN {
	UPDATE customer MERGE {
		workspace: $auth.workspace,
		created_at: time::now()
	} WHERE id = $after.id;
};

DEFINE EVENT delete_customer_invoices ON TABLE customer WHEN $event = "DELETE" THEN {
	DELETE invoice WHERE customer = $before.id;
};

DEFINE EVENT invoice_created ON TABLE invoice WHEN $event = "CREATE" THEN {
	UPDATE invoice MERGE {
		workspace: $auth.workspace,
		created_at: time::now()
	} WHERE id = $after.id;
};

DEFINE EVENT event_created ON TABLE event WHEN $event = "CREATE" THEN {
	UPDATE event MERGE {
		workspace: $auth.workspace,
		created_at: time::now()
	} WHERE id = $after.id;
};

DEFINE EVENT item_created ON TABLE item WHEN $event = "CREATE" THEN {
	UPDATE item MERGE {
		workspace: $auth.workspace,
		created_at: time::now()
	} WHERE id = $after.id;
};

-- ------------------------------
-- TABLE: user
-- ------------------------------

DEFINE TABLE user SCHEMAFULL
PERMISSIONS FOR select, update, delete WHERE id = $auth.id;

DEFINE FIELD password ON user TYPE string;
DEFINE FIELD email ON user TYPE string;
DEFINE FIELD username ON user TYPE string;
DEFINE FIELD workspace ON user TYPE string;

DEFINE INDEX idx_user ON user FIELDS email UNIQUE;

-- ------------------------------
-- TABLE: profile
-- ------------------------------

DEFINE TABLE profile SCHEMALESS PERMISSIONS FOR select, update WHERE user = $auth.id, FOR create, delete NONE;

-- ------------------------------
-- TABLE: customer
-- ------------------------------

DEFINE TABLE customer SCHEMALESS PERMISSIONS FOR select, update, delete WHERE workspace = $auth.workspace, FOR create WHERE true;

-- ------------------------------
-- TABLE: invoice
-- ------------------------------

DEFINE TABLE invoice SCHEMALESS PERMISSIONS FOR select, update, delete WHERE workspace = $auth.workspace, FOR create WHERE true;

-- ------------------------------
-- TABLE: event
-- ------------------------------

DEFINE TABLE event SCHEMALESS PERMISSIONS FOR select, update, delete WHERE workspace = $auth.workspace, FOR create WHERE true;

-- ------------------------------
-- TABLE: item
-- ------------------------------

DEFINE TABLE item SCHEMALESS PERMISSIONS FOR select, update, delete WHERE workspace = $auth.workspace, FOR create WHERE true;