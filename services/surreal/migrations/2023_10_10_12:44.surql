DEFINE TABLE eventtype SCHEMALESS PERMISSIONS FOR update, delete WHERE workspace = type::string($auth.workspace), FOR create, select WHERE true;

DEFINE EVENT set_eventtype_workspace ON TABLE eventtype WHEN $event = "CREATE" THEN {
	UPDATE eventtype MERGE {
		workspace: type::string($auth.workspace)
	} WHERE id = $after.id;
};
