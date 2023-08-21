-- ------------------------------
-- OPTION
-- ------------------------------

OPTION IMPORT;

-- ------------------------------
-- SCOPES
-- ------------------------------

DEFINE SCOPE allusers 
SESSION 2w 
SIGNUP (
		CREATE user 
		SET 
			email = $email,
			username = IF $username THEN $username ELSE string::concat('@', string::split($email, '@')[0]) END,
			password = crypto::argon2::generate($password),
			workspace = IF $workspace THEN $workspace ELSE (CREATE workspace).id END
)
SIGNIN (
	SELECT * FROM user 
	WHERE 
		email = $email AND crypto::argon2::compare(password, $password)
);

-- ------------------------------
-- EVENTS
-- ------------------------------

DEFINE EVENT profile ON TABLE user WHEN $before == NONE THEN (
	CREATE profile SET user = $value.id
);

DEFINE EVENT customer_workspace ON TABLE customer WHEN $event = "CREATE" THEN {
	UPDATE customer MERGE {
		workspace: $auth.workspace
	} WHERE id = $after.id;
};

DEFINE EVENT invoice_workspace ON TABLE invoice WHEN $event = "CREATE" THEN {
	UPDATE invoice MERGE {
		workspace: $auth.workspace
	} WHERE id = $after.id;
};

-- ------------------------------
-- TABLE: user
-- ------------------------------

DEFINE TABLE user SCHEMAFULL PERMISSIONS FOR select, update WHERE id = $auth.id, FOR create, delete NONE;

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
