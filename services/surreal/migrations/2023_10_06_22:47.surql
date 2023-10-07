DEFINE TABLE user SCHEMAFULL PERMISSIONS FOR update, delete WHERE id = $auth.id FOR select WHERE id = $auth.id OR workspace = $auth.workspace;

DEFINE TABLE profile SCHEMALESS PERMISSIONS FOR update WHERE user = $auth.id, FOR select WHERE user = $auth.id OR workspace = $auth.workspace FOR create, delete NONE;

DEFINE TABLE invite SCHEMALESS PERMISSIONS FOR select, update, delete WHERE workspace = $auth.workspace, FOR create WHERE true;

DEFINE EVENT set_invite_workspace ON TABLE invite WHEN $event = "CREATE" THEN {
	UPDATE invite MERGE {
		workspace: $auth.workspace,
		created_at: time::now()
	} WHERE id = $after.id;
};

DEFINE INDEX idx_invite ON invite FIELDS email UNIQUE;

DEFINE TABLE workspace SCHEMALESS PERMISSIONS FOR create, delete WHERE true;