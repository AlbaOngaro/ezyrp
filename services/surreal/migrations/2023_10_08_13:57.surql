DEFINE TABLE workspace SCHEMALESS PERMISSIONS FOR select, update, delete WHERE type::string(id) = $auth.workspace, FOR create WHERE true;

DEFINE EVENT workspace_settings ON TABLE workspace WHEN $event = "CREATE" THEN {
	CREATE settings CONTENT {
		workspace: type::string($after.id)
	};
};

DEFINE TABLE settings SCHEMALESS PERMISSIONS FOR select, update, delete WHERE workspace = type::string($auth.workspace), FOR create WHERE true;
