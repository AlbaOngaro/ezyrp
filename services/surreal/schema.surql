-- ------------------------------
-- OPTION
-- ------------------------------

OPTION IMPORT;

-- ------------------------------
-- PARAMS
-- ------------------------------

DEFINE PARAM $brevoapikey VALUE "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";

-- ------------------------------
-- SCOPES
-- ------------------------------

DEFINE SCOPE allusers SESSION 2w 
SIGNUP (
	CREATE user CONTENT {
		email: $email,
		username: IF $username THEN $username ELSE string::concat('@', string::split($email, '@')[0]) END,
		password: crypto::argon2::generate($password),
		workspace: IF $workspace THEN $workspace ELSE type::string((SELECT VALUE id FROM (CREATE workspace))[0]) END
	}
)
SIGNIN (
	SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(password, $password)
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

	LET $items = 
		SELECT
		(SELECT id, count() FROM $this.items GROUP BY	id) as items 
	FROM $after.id FETCH items;

	UPDATE item
	SET
		quantity = IF (SELECT count FROM $items[0].items WHERE id = $parent.id)[0].count THEN $this.quantity - (SELECT count FROM $items[0].items WHERE id = $parent.id)[0].count ELSE $this.quantity END; 

	LET $customer = SELECT customer FROM invoice WHERE id = $after.id FETCH customer;

	INSERT INTO email {
		email: (SELECT VALUE customer FROM $customer)[0].email,
		name: (SELECT VALUE customer FROM $customer)[0].name,
		status: http::post('https://api.brevo.com/v3/smtp/email', {  
			"sender": {  
				"email": "info@nimblerp.com"
			},
			"to": [  
				{  
					"email": (SELECT VALUE customer FROM $customer)[0].email,
					"name": (SELECT VALUE customer FROM $customer)[0].name
				}
			],
			"params": {
				"invoice_url": string::concat("http://localhost:3000/invoices/", $after.id) ,
				"invoice_id": $after.id,
				"emitted": time::format($after.emitted, "%d/%m/%Y"),
				"due": time::format($after.due, "%d/%m/%Y")
			},
			"templateId": 3,
		}, {
			accept: 'application/json',
			'content-type': 'application/json',
			'api-key': $brevoapikey
		})
	};
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

DEFINE EVENT item_deleted ON TABLE item WHEN $event = "DELETE" THEN {
	UPDATE invoice 
	SET items = (SELECT VALUE id FROM $this.items WHERE id != $before.id)
	WHERE $before.id IN items.id;
};

-- ------------------------------
-- TABLE: user
-- ------------------------------

DEFINE TABLE user SCHEMAFULL PERMISSIONS FOR select, update, delete WHERE id = $auth.id;

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

-- ------------------------------
-- TABLE: email
-- ------------------------------

DEFINE TABLE email SCHEMALESS PERMISSIONS FOR select, update, delete WHERE workspace = $auth.workspace, FOR create WHERE true;